package commands

import (
	"fmt"
	"strconv"
	"weekbot-go/internal/models"

	"github.com/bwmarrin/discordgo"
)

// GetConfigCommand returns the config command definition with subcommands
func GetConfigCommand() *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:        "config",
		Description: "Configure bot settings for this server",
		Type:        discordgo.ChatApplicationCommand,
		Options: []*discordgo.ApplicationCommandOption{
			{
				Name:        "view",
				Description: "View current bot settings",
				Type:        discordgo.ApplicationCommandOptionSubCommand,
			},
			{
				Name:        "set",
				Description: "Update a bot setting",
				Type:        discordgo.ApplicationCommandOptionSubCommand,
				Options: []*discordgo.ApplicationCommandOption{
					{
						Name:        "setting",
						Description: "The setting to update",
						Type:        discordgo.ApplicationCommandOptionString,
						Required:    true,
						Choices: []*discordgo.ApplicationCommandOptionChoice{
							{Name: "updick_threshold", Value: "updick_threshold"},
							{Name: "min_votes_to_end", Value: "min_votes_to_end"},
							{Name: "reaction_emoji", Value: "reaction_emoji"},
							{Name: "max_suggestion_length", Value: "max_suggestion_length"},
						},
					},
					{
						Name:        "value",
						Description: "The new value for the setting",
						Type:        discordgo.ApplicationCommandOptionString,
						Required:    true,
					},
				},
			},
		},
	}
}

// HandleConfigCommand handles the /config command interaction
func HandleConfigCommand(s *discordgo.Session, i *discordgo.InteractionCreate) {
	// Check if user has admin permissions
	if !hasAdminPermission(s, i) {
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Content: "You need Administrator permissions to use this command.",
				Flags:   discordgo.MessageFlagsEphemeral,
			},
		})
		return
	}

	bot := models.GetBot(i.GuildID)
	if bot == nil {
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Content: "Error: Bot not found for this guild",
				Flags:   discordgo.MessageFlagsEphemeral,
			},
		})
		return
	}

	options := i.ApplicationCommandData().Options
	if len(options) == 0 {
		return
	}

	subCommand := options[0].Name

	switch subCommand {
	case "view":
		handleConfigView(s, i, bot)
	case "set":
		handleConfigSet(s, i, bot, options[0].Options)
	}
}

func handleConfigView(s *discordgo.Session, i *discordgo.InteractionCreate, bot *models.Bot) {
	settings := models.GetGuildSettings(bot.DB, bot.GuildID)
	if settings == nil {
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Content: "Error: Could not retrieve settings",
				Flags:   discordgo.MessageFlagsEphemeral,
			},
		})
		return
	}

	content := fmt.Sprintf("**Bot Settings for this Server:**\n\n"+
		"**updick_threshold:** %d (reactions needed for poll eligibility)\n"+
		"**min_votes_to_end:** %d (minimum ballots to end a poll)\n"+
		"**reaction_emoji:** %s (emoji that marks suggestions)\n"+
		"**max_suggestion_length:** %d (max characters for suggestions)\n",
		settings.UpdickThreshold,
		settings.MinVotesToEnd,
		settings.ReactionEmoji,
		settings.MaxSuggestionLength,
	)

	s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Content: content,
			Flags:   discordgo.MessageFlagsEphemeral,
		},
	})
}

func handleConfigSet(s *discordgo.Session, i *discordgo.InteractionCreate, bot *models.Bot, options []*discordgo.ApplicationCommandInteractionDataOption) {
	var settingName, settingValue string
	for _, opt := range options {
		switch opt.Name {
		case "setting":
			settingName = opt.StringValue()
		case "value":
			settingValue = opt.StringValue()
		}
	}

	var err error
	var displayValue string

	switch settingName {
	case "updick_threshold", "min_votes_to_end", "max_suggestion_length":
		intValue, parseErr := strconv.Atoi(settingValue)
		if parseErr != nil {
			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Content: fmt.Sprintf("Error: '%s' must be a number", settingName),
					Flags:   discordgo.MessageFlagsEphemeral,
				},
			})
			return
		}
		if intValue < 1 {
			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Content: fmt.Sprintf("Error: '%s' must be at least 1", settingName),
					Flags:   discordgo.MessageFlagsEphemeral,
				},
			})
			return
		}
		err = models.UpdateGuildSetting(bot.DB, bot.GuildID, settingName, intValue)
		displayValue = settingValue

	case "reaction_emoji":
		err = models.UpdateGuildSetting(bot.DB, bot.GuildID, settingName, settingValue)
		displayValue = settingValue
	}

	if err != nil {
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Content: fmt.Sprintf("Error updating setting: %v", err),
				Flags:   discordgo.MessageFlagsEphemeral,
			},
		})
		return
	}

	s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Content: fmt.Sprintf("✅ Successfully updated **%s** to **%s**", settingName, displayValue),
			Flags:   discordgo.MessageFlagsEphemeral,
		},
	})
}

func hasAdminPermission(s *discordgo.Session, i *discordgo.InteractionCreate) bool {
	// Get member permissions
	if i.Member == nil {
		return false
	}

	// Check if user has Administrator permission
	return i.Member.Permissions&discordgo.PermissionAdministrator != 0
}
