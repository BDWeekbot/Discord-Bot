package commands

import (
	"fmt"
	"log"
	"strings"
	"weekbot-go/internal/models"

	"github.com/bwmarrin/discordgo"
)

// HandleWeekPoll handles the /poll command
func HandleWeekPoll(s *discordgo.Session, m *discordgo.InteractionCreate) {
	bot := models.GetBot(m.GuildID)

	println("HandleWeekPoll - Guild ID:", m.GuildID)
	println("HandleWeekPoll - Bot Guild ID:", bot.GuildID)

	poll := models.NewOrCurrentPoll(bot)

	if poll == nil {
		println("poll is nil")
		s.InteractionRespond(m.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Content: "Not Enough Suggestions to Start Poll",
			},
		})
		return
	}

	s.InteractionRespond(m.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Content: "Poll has started @everyone",
			Components: []discordgo.MessageComponent{
				&discordgo.ActionsRow{
					Components: []discordgo.MessageComponent{
						&discordgo.Button{
							CustomID: "poll_button",
							Label:    "Vote Here",
							Style:    discordgo.PrimaryButton,
							Emoji: discordgo.ComponentEmoji{
								Name: "🗳️",
							},
						},
					},
				},
			},
		},
	})
}

func HandleEndPoll(s *discordgo.Session, m *discordgo.InteractionCreate) {
	bot := models.GetBot(m.GuildID)

	poll := models.GetCurrentPoll(bot.DB)
	ellibleBallots := 0

	println("HandleEndPoll - Guild ID:", m.GuildID)
	println("HandleEndPoll - Bot Guild ID:", bot.GuildID)

	if poll == nil {
		println("HandleEndPoll - No current poll found")
		s.InteractionRespond(m.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Content: "No poll is currently in progress",
			},
		})
		return
	}

	println("HandleEndPoll - Poll found with", len(poll.Ballots), "total ballots")

	for i, ballot := range poll.Ballots {
		println("HandleEndPoll - Ballot", i, "VoterID:", ballot.VoterId, "Cast:", ballot.Cast, "Choices:", ballot.FirstChoice, ballot.SecondChoice, ballot.ThirdChoice)
		if ballot.Cast {
			ellibleBallots++
		}
	}

	println("HandleEndPoll - Eligible ballots:", ellibleBallots)

	settings := models.GetGuildSettings(bot.DB, m.GuildID)
	minVotes := 5
	if settings != nil {
		minVotes = settings.MinVotesToEnd
	}

	if ellibleBallots < minVotes {
		s.InteractionRespond(m.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Content: fmt.Sprintf("You do not have enough votes to end the poll. Found %d cast ballots, need %d.", ellibleBallots, minVotes),
			},
		})
		return
	}

	// change server name

	newName := poll.PerformRankedChoiceVoting()

	println("New name is: " + newName)
	_, err := s.GuildEdit(m.GuildID, &discordgo.GuildParams{
		Name: newName,
	})
	if err != nil {
		log.Printf("Error changing server name: %v", err)

	}
	log.Printf("Server name changed to: %s", newName)

	// end poll
	poll.EndPoll()

	// Mark all suggestions in this poll as used
	for i := range poll.Suggestions {
		poll.Suggestions[i].Used = true
		bot.DB.Save(&poll.Suggestions[i])
	}

	bot.DB.Save(poll)

	s.InteractionRespond(m.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Content: "The poll has been ended",
		},
	})

	// end listener for select menu
}

func GetPollCommand() *discordgo.ApplicationCommand {
	pollCommand := &discordgo.ApplicationCommand{
		Name:        "poll",
		Description: "Run the Week Name Poll",
		Type:        discordgo.ChatApplicationCommand,
	}
	return pollCommand
}

func EndPollCommand() *discordgo.ApplicationCommand {
	pollCommand := &discordgo.ApplicationCommand{
		Name:        "endpoll",
		Description: "End the Week Name Poll",
		Type:        discordgo.ChatApplicationCommand,
	}
	return pollCommand
}

// HandleCurrentPollOptions handles the /currentpolloptions command
func HandleCurrentPollOptions(s *discordgo.Session, m *discordgo.InteractionCreate) {
	bot := models.GetBot(m.GuildID)
	if bot == nil {
		s.InteractionRespond(m.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Content: "Error: Bot not found for this guild",
				Flags:   discordgo.MessageFlagsEphemeral,
			},
		})
		return
	}

	println("HandleCurrentPollOptions - Guild ID:", m.GuildID)
	println("HandleCurrentPollOptions - Bot Guild ID:", bot.GuildID)

	settings := models.GetGuildSettings(bot.DB, m.GuildID)
	threshold := 3
	if settings != nil {
		threshold = settings.UpdickThreshold
	}

	// Get all unused suggestions with threshold+ updicks (same criteria as poll creation)
	suggestions := models.GetMostRecentUnusedSuggestionsForGuild(bot.DB, bot.GuildID)

	println("HandleCurrentPollOptions - Suggestions found:", len(suggestions))

	if len(suggestions) == 0 {
		s.InteractionRespond(m.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Content: fmt.Sprintf("No suggestions are currently available for polling. Suggestions need at least %d updicks to be eligible.", threshold),
				Flags:   discordgo.MessageFlagsEphemeral,
			},
		})
		return
	}

	// Remove duplicates (same logic as in Poll.GetSelectOptions)
	var filteredSuggestions []models.Suggestion
	for _, suggestion := range suggestions {
		isDuplicate := false
		for _, filtered := range filteredSuggestions {
			if strings.EqualFold(suggestion.Content, filtered.Content) {
				isDuplicate = true
				break
			}
		}
		if !isDuplicate && suggestion.Updicks >= threshold {
			filteredSuggestions = append(filteredSuggestions, suggestion)
		}
	}

	// Build the response message
	var responseBuilder strings.Builder
	responseBuilder.WriteString("**Current Poll Options Available:**\n")
	responseBuilder.WriteString(fmt.Sprintf("Found %d eligible suggestions:\n\n", len(filteredSuggestions)))

	for i, suggestion := range filteredSuggestions {
		responseBuilder.WriteString(fmt.Sprintf("%d. **%s** (👍 %d updicks)\n",
			i+1, suggestion.Content, suggestion.Updicks))
	}

	responseBuilder.WriteString(fmt.Sprintf("\n*Suggestions need at least %d updicks to be eligible for polls.*", threshold))

	if len(filteredSuggestions) >= 3 {
		responseBuilder.WriteString("\n✅ **Ready to start a poll!**")
	} else {
		responseBuilder.WriteString(fmt.Sprintf("\n⚠️ **Need %d more suggestions to start a poll.**", 3-len(filteredSuggestions)))
	}

	s.InteractionRespond(m.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Content: responseBuilder.String(),
			Flags:   discordgo.MessageFlagsEphemeral,
		},
	})
}

// GetCurrentPollOptionsCommand returns the command definition for currentpolloptions
func GetCurrentPollOptionsCommand() *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:        "currentpolloptions",
		Description: "List all suggestions currently eligible for polling",
		Type:        discordgo.ChatApplicationCommand,
	}
}
