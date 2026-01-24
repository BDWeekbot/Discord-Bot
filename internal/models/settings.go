package models

import (
	"gorm.io/gorm"
)

type GuildSettings struct {
	gorm.Model
	GuildID             string `gorm:"uniqueIndex"`
	UpdickThreshold     int    `gorm:"default:3"`
	MinVotesToEnd       int    `gorm:"default:5"`
	ReactionEmoji       string `gorm:"default:bd"`
	MaxSuggestionLength int    `gorm:"default:100"`
}

// GetGuildSettings returns the settings for a guild, creating defaults if none exist
func GetGuildSettings(db *gorm.DB, guildID string) *GuildSettings {
	var settings GuildSettings
	result := db.Where("guild_id = ?", guildID).First(&settings)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			// Create default settings
			settings = GuildSettings{
				GuildID:             guildID,
				UpdickThreshold:     3,
				MinVotesToEnd:       5,
				ReactionEmoji:       "bd",
				MaxSuggestionLength: 100,
			}
			db.Create(&settings)
			return &settings
		}
		println("Error getting guild settings:", result.Error.Error())
		return nil
	}
	return &settings
}

// UpdateGuildSetting updates a single setting for a guild
func UpdateGuildSetting(db *gorm.DB, guildID string, key string, value interface{}) error {
	settings := GetGuildSettings(db, guildID)
	if settings == nil {
		return gorm.ErrRecordNotFound
	}

	switch key {
	case "updick_threshold":
		settings.UpdickThreshold = value.(int)
	case "min_votes_to_end":
		settings.MinVotesToEnd = value.(int)
	case "reaction_emoji":
		settings.ReactionEmoji = value.(string)
	case "max_suggestion_length":
		settings.MaxSuggestionLength = value.(int)
	}

	return db.Save(settings).Error
}
