package models

import (
	"strings"

	"gorm.io/gorm"
)

type Suggestion struct {
	gorm.Model
	Content string
	Used    bool
	GuildID string
	Updicks int
	PollID  uint
}

func NewSuggestion(db *gorm.DB, content string, guildID string) *Suggestion {
	// Validate and clean the content
	content = strings.TrimSpace(content)
	if content == "" {
		println("NewSuggestion: rejected empty content")
		return nil
	}
	settings := GetGuildSettings(db, guildID)
	maxLength := 100
	if settings != nil {
		maxLength = settings.MaxSuggestionLength
	}
	if len(content) > maxLength {
		println("NewSuggestion: content too long, truncating to", maxLength, "chars")
		content = content[:maxLength]
	}

	s := &Suggestion{
		Content: content,
		GuildID: guildID,
		Used:    false,
		Updicks: 0,
	}
	result := db.Create(s)
	if result.Error != nil {
		panic(result.Error)
	} else {
		println("Suggestion created ", result.RowsAffected)
	}

	// Debug print to verify the saved record
	var savedSuggestion Suggestion
	db.First(&savedSuggestion, "content = ? AND guild_id = ?", content, guildID)
	println("Saved Suggestion: ", savedSuggestion.Content, savedSuggestion.GuildID, savedSuggestion.Updicks)

	return s
}

func UpdateSuggestion(db *gorm.DB, content string, guildID string, updicks int) {
	content = strings.TrimSpace(content)
	if content == "" {
		println("UpdateSuggestion: rejected empty content")
		return
	}

	var suggestion Suggestion
	result := db.First(&suggestion, "content = ? AND guild_id = ?", content, guildID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			// Suggestion not found, create a new one
			newSuggestion := NewSuggestion(db, content, guildID)
			if newSuggestion == nil {
				return
			}
			suggestion = *newSuggestion
		} else {
			// Some other error occurred
			println("Error updating suggestion: ", result.Error)
			return
		}
	}

	suggestion.Updicks = updicks
	result = db.Save(&suggestion)
	if result.Error != nil {
		println("Error updating suggestion: ", result.Error)
	}

	println("Suggestion updated ", result.RowsAffected)
}

func GetMostRecentUnusedSuggestions(db *gorm.DB, guildID string) []Suggestion {
	var suggestions []Suggestion
	settings := GetGuildSettings(db, guildID)
	threshold := 3
	if settings != nil {
		threshold = settings.UpdickThreshold
	}
	db.Where("used = ? AND updicks >= ?", false, threshold).Find(&suggestions)
	return suggestions
}

func GetMostRecentUnusedSuggestionsForGuild(db *gorm.DB, guildID string) []Suggestion {
	var suggestions []Suggestion
	settings := GetGuildSettings(db, guildID)
	threshold := 3
	if settings != nil {
		threshold = settings.UpdickThreshold
	}
	println("GetMostRecentUnusedSuggestionsForGuild - Guild ID:", guildID)
	result := db.Where("used = ? AND updicks >= ? AND guild_id = ?", false, threshold, guildID).Find(&suggestions)
	println("GetMostRecentUnusedSuggestionsForGuild - Found:", len(suggestions), "suggestions")
	println("GetMostRecentUnusedSuggestionsForGuild - SQL result rows affected:", result.RowsAffected)

	// Debug: let's see what guild IDs actually exist in the database
	var allSuggestions []Suggestion
	db.Where("used = ? AND updicks >= ?", false, 3).Find(&allSuggestions)
	println("GetMostRecentUnusedSuggestionsForGuild - Total suggestions with 3+ updicks:", len(allSuggestions))
	for i, s := range allSuggestions {
		if i < 5 { // Only print first 5 to avoid spam
			println("GetMostRecentUnusedSuggestionsForGuild - Suggestion", i, "Guild ID:", s.GuildID, "Content:", s.Content, "Updicks:", s.Updicks)
		}
	}

	return suggestions
}
