package handlers

import (
	"fmt"
	"strings"

	actions "weekbot-go/internal/actions"
	commands "weekbot-go/internal/commands"
	"weekbot-go/internal/models"

	"github.com/bwmarrin/discordgo"
)

// ParseCommand parses a command from a message
func ParseInteraction(s *discordgo.Session, i *discordgo.InteractionCreate) {
	command := i.Type

	switch command {
	case discordgo.InteractionApplicationCommand:
		switch i.ApplicationCommandData().Name {
		case "ping":
			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{Content: "Pong!"},
			})
		case "poll":
			commands.HandleWeekPoll(s, i)
		case "endpoll":
			commands.HandleEndPoll(s, i)
		case "currentpolloptions":
			commands.HandleCurrentPollOptions(s, i)
		case "config":
			commands.HandleConfigCommand(s, i)
		default:
			fmt.Println("Unknown command:", i.ApplicationCommandData().Name)
		}
	default: // Ignore other types of interactions
		return
	}
}

func ParseChatCommand(s *discordgo.Session, m *discordgo.MessageCreate) {
	// React to only messages not sent by the bot
	if m.Author.ID == s.State.User.ID {
		return
	}
	// If the message ends in the word week, add it to the list of suggestions for the poll
	message := strings.Split(m.Content, " ")
	acceptableWeeks := []string{"week", "week.", "week!", "week?"} // move to constants file
	for _, week := range acceptableWeeks {
		if strings.ToLower(message[len(message)-1]) == week {
			actions.HandleWeekSuggestion(s, m)
			break
		}
	}
}

func HandleReactions(s *discordgo.Session, r *discordgo.MessageReactionAdd) {
	// React to only messages not sent by the bot
	if r.UserID == s.State.User.ID {
		return
	}
	bot := models.GetBot(r.GuildID)
	emoji := r.Emoji.Name
	if r.Emoji.ID != "" {
		emoji = fmt.Sprintf(":%s:%s", r.Emoji.Name, r.Emoji.ID)
	}
	m, err := s.ChannelMessage(r.ChannelID, r.MessageID)
	if err != nil {
		fmt.Println("Error retrieving message:", err)
		return
	}
	reaction, err := s.MessageReactions(r.ChannelID, r.MessageID, emoji, 100, "", "")

	if err != nil {
		fmt.Println("Error getting reactions:", err)
		return
	}

	settings := models.GetGuildSettings(bot.DB, r.GuildID)
	if settings == nil {
		fmt.Println("Error getting guild settings")
		return
	}

	fmt.Printf("Reaction check: emoji='%s', expected='%s', count=%d, threshold=%d\n",
		r.Emoji.Name, settings.ReactionEmoji, len(reaction), settings.UpdickThreshold)
	if r.Emoji.Name == settings.ReactionEmoji && len(reaction) >= settings.UpdickThreshold {
		models.UpdateSuggestion(bot.DB, m.Content, r.GuildID, len(reaction))
		err = s.MessageReactionAdd(r.ChannelID, r.MessageID, "👍")
		if err != nil {
			fmt.Println("Error adding thumbsup reaction:", err)
		} else {
			fmt.Println("Added thumbsup reaction to message:", r.MessageID)
		}
	}
}
