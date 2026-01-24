package handlers

import (
	"log"
	"time"
	"weekbot-go/internal/models"

	"github.com/bwmarrin/discordgo"
)

func HandlePollInteractions(s *discordgo.Session, i *discordgo.InteractionCreate) {
	if i.Type != discordgo.InteractionMessageComponent {
		return
	}

	bot := models.GetBot(i.GuildID)
	if bot == nil {
		println("Bot is nil")
		return
	}

	switch i.MessageComponentData().CustomID {
	case "poll_button":
		handlePollButton(s, i, bot)
	case "first_choice", "second_choice", "third_choice":
		handleChoiceSelection(s, i, bot)
	case "submit_button":
		handleSubmitButton(s, i, bot)
	}
}

func handlePollButton(s *discordgo.Session, i *discordgo.InteractionCreate, bot *models.Bot) {
	poll := models.NewOrCurrentPoll(bot)
	if poll == nil {
		println("Poll is nil")
		return
	}

	if i.Member == nil {
		println("Member is nil")
		return
	}

	if poll.BallotCast(i.Member.User.ID) {
		err := s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Content: "You have already voted",
				Flags:   discordgo.MessageFlagsEphemeral,
			},
		})
		if err != nil {
			println("Error responding to interaction: %v", err)
		}
		return
	}

	if !poll.HasBallot(i.Member.User.ID) {
		ballot := models.Ballot{
			VoterId: i.Member.User.ID,
			PollID:  poll.ID,
			Date:    time.Now(),
			Cast:    false,
		}
		poll.AddBallotForVoter(bot, ballot)
	}

	err := s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Content: "Select your options",
			Flags:   discordgo.MessageFlagsEphemeral,
			Components: []discordgo.MessageComponent{
				&discordgo.ActionsRow{
					Components: []discordgo.MessageComponent{
						discordgo.SelectMenu{
							CustomID:    "first_choice",
							Placeholder: "Select your 1st choice",
							Options:     poll.GetSelectOptions(),
						},
					},
				},
				&discordgo.ActionsRow{
					Components: []discordgo.MessageComponent{
						discordgo.SelectMenu{
							CustomID:    "second_choice",
							Placeholder: "Select your 2nd choice",
							Options:     poll.GetSelectOptions(),
						},
					},
				},
				&discordgo.ActionsRow{
					Components: []discordgo.MessageComponent{
						discordgo.SelectMenu{
							CustomID:    "third_choice",
							Placeholder: "Select your 3rd choice",
							Options:     poll.GetSelectOptions(),
						},
					},
				},
				&discordgo.ActionsRow{
					Components: []discordgo.MessageComponent{
						&discordgo.Button{
							CustomID: "submit_button",
							Label:    "Submit",
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

	if err != nil {
		log.Printf("Error responding to interaction: %v", err)
	}
}

func handleChoiceSelection(s *discordgo.Session, i *discordgo.InteractionCreate, bot *models.Bot) {
	err := s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseDeferredMessageUpdate,
	})
	if err != nil {
		log.Printf("Error responding to interaction: %v", err)
		return
	}

	ballot := models.GetBallotByVoterID(bot.DB, i.Member.User.ID)
	if ballot == nil {
		// This should not happen if the poll_button logic is correct
		return
	}
	customID := i.MessageComponentData().CustomID
	selectedValue := i.MessageComponentData().Values[0]

	switch customID {
	case "first_choice":
		ballot.FirstChoice = selectedValue
	case "second_choice":
		ballot.SecondChoice = selectedValue
	case "third_choice":
		ballot.ThirdChoice = selectedValue
	}

	bot.DB.Save(ballot)
}

func handleSubmitButton(s *discordgo.Session, i *discordgo.InteractionCreate, bot *models.Bot) {
	ballot := models.GetBallotByVoterID(bot.DB, i.Member.User.ID)
	if ballot == nil {
		// This should not happen
		return
	}

	if ballot.FirstChoice == "" || ballot.SecondChoice == "" || ballot.ThirdChoice == "" {
		err := s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Content: "Please select all three choices before submitting.",
				Flags:   discordgo.MessageFlagsEphemeral,
			},
		})
		if err != nil {
			log.Printf("Error responding to interaction: %v", err)
		}
		return
	}

	ballot.Cast = true
	bot.DB.Save(&ballot)

	err := s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Content: "Your vote has been submitted!",
			Flags:   discordgo.MessageFlagsEphemeral,
		},
	})
	if err != nil {
		log.Printf("Error responding to interaction: %v", err)
	}
}
