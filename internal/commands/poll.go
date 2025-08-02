package commands

import (
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"
	"weekbot-go/internal/models"

	"github.com/bwmarrin/discordgo"
)

// HandleWeekPoll handles the /poll command
func HandleWeekPoll(s *discordgo.Session, m *discordgo.InteractionCreate) {
	bot := models.GetBot(m.GuildID)

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

	/// Single Use DB Functions Here ----- /////

	// // Get all ballots
	// ballots := models.GetAllBallots(bot.DB)

	// // // delete all ballots
	// for _, ballot := range ballots {
	// 	bot.DB.Delete(&ballot)
	// 	println("Ballot: " + ballot.VoterId + " Deleted")
	// }

	// end poll

	//poll.EndPoll()
	// Delete all balllots
	//

	////// -------------- ////////////

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

	// click button, check if userId in array, if no show modal, select option, submit, add userId to array, add ballot to poll
	// done =======, done ===================, done ===========,

	// poll button handler

	s.AddHandler(func(s *discordgo.Session, i *discordgo.InteractionCreate) {

		if i.Type == discordgo.InteractionMessageComponent && i.MessageComponentData().CustomID == "poll_button" {
			bot := models.GetBot(i.GuildID)
			if bot == nil {
				println("Bot is nil")
				return
			}
			ballots := models.GetAllBallots(bot.DB)

			for _, ballot := range ballots {
				println("Ballot: " + ballot.VoterId)
			}

			poll := models.NewOrCurrentPoll(bot)
			if poll == nil {
				println("Poll is nil")
				return
			}
			println("handler poll pull ")

			if i.Member == nil {
				println("Member is nil")
				return
			}

			pollBallots := poll.GetBallots()
			for _, ballot := range pollBallots {
				println("Poll Button -- Initial Check Poll Ballot: " + ballot.VoterId)
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
					return
				}
			} else if poll.HasBallot(i.Member.User.ID) {
				println("Has Ballot -- Ballot exists")
			} else {
				ballot := models.Ballot{
					VoterId: i.Member.User.ID,
					PollID:  poll.ID,
					Date:    time.Now(),
					Cast:    false,
				}
				println("Has Ballot -- Ballot created")
				poll.AddBallotForVoter(bot, ballot)
				pollBallots := poll.GetBallots()
				for _, ballot := range pollBallots {
					println("Has Ballot -- Poll Ballot Print at Ballot Creation in : " + ballot.VoterId)
				}
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
									Placeholder: "Select a week",
									Options:     poll.GetSelectOptions(),
								},
							},
						},
						&discordgo.ActionsRow{
							Components: []discordgo.MessageComponent{
								discordgo.SelectMenu{
									CustomID:    "second_choice",
									Placeholder: "Select a week",
									Options:     poll.GetSelectOptions(),
								},
							},
						},
						&discordgo.ActionsRow{
							Components: []discordgo.MessageComponent{
								discordgo.SelectMenu{
									CustomID:    "third_choice",
									Placeholder: "Select a week",
									Options:     poll.GetSelectOptions(),
								},
							},
						},
						&discordgo.ActionsRow{
							Components: []discordgo.MessageComponent{
								discordgo.Button{
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
				return
			}
		}
	})
	// create listener for select menu

	s.AddHandler(func(s *discordgo.Session, i *discordgo.InteractionCreate) {
		if i.Type == discordgo.InteractionApplicationCommand {
			// This is a slash command interaction
		} else if i.Type == discordgo.InteractionMessageComponent && i.MessageComponentData().CustomID == "first_choice" {
			{
				// This is a select menu interaction
				// You can access the selected options with i.MessageComponent.Values
				err := s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
					Type: discordgo.InteractionResponseDeferredMessageUpdate,
				})
				if err != nil {
					log.Printf("Error responding to interaction: %v", err)
					return
				}

				ballot := models.GetBallotByVoterID(bot.DB, i.Member.User.ID)
				ballot.FirstChoice = i.MessageComponentData().Values[0]
				bot.DB.Save(ballot)
				println("First choice: " + i.MessageComponentData().Values[0])
			}
		} else if i.Type == discordgo.InteractionMessageComponent && i.MessageComponentData().CustomID == "second_choice" {
			{
				// This is a select menu interaction
				// You can access the selected options with i.MessageComponent.Values
				err := s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
					Type: discordgo.InteractionResponseDeferredMessageUpdate,
				})
				if err != nil {
					log.Printf("Error responding to interaction: %v", err)
					return
				}
				ballot := models.GetBallotByVoterID(bot.DB, i.Member.User.ID)
				ballot.SecondChoice = i.MessageComponentData().Values[0]
				bot.DB.Save(ballot)
				println("Second choice: " + i.MessageComponentData().Values[0])
			}
		} else if i.Type == discordgo.InteractionMessageComponent && i.MessageComponentData().CustomID == "third_choice" {
			{
				// This is a select menu interaction
				// You can access the selected options with i.MessageComponent.Values
				err := s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
					Type: discordgo.InteractionResponseDeferredMessageUpdate,
				})
				if err != nil {
					log.Printf("Error responding to interaction: %v", err)
					return
				}
				ballot := models.GetBallotByVoterID(bot.DB, i.Member.User.ID)
				ballot.ThirdChoice = i.MessageComponentData().Values[0]
				bot.DB.Save(ballot)
				println("Third choice: " + i.MessageComponentData().Values[0])
			}
		}
	})

	s.AddHandler(func(s *discordgo.Session, i *discordgo.InteractionCreate) {
		if i.Type == discordgo.InteractionApplicationCommand {
			// This is a slash command interaction
		} else if i.Type == discordgo.InteractionMessageComponent && i.MessageComponentData().CustomID == "submit_button" {
			ballot := models.GetBallotByVoterID(bot.DB, i.Member.User.ID)
			if ballot.FirstChoice == "" || ballot.SecondChoice == "" || ballot.ThirdChoice == "" {
				err := s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
					Type: discordgo.InteractionResponseChannelMessageWithSource,
					Data: &discordgo.InteractionResponseData{
						Content: "Please select all options",
						Flags:   discordgo.MessageFlagsEphemeral,
					},
				})
				if err != nil {
					log.Printf("Error responding to interaction: %v", err)
					return
				}
			} else {

				ballot.Cast = true
				println("ballot cast: " + strconv.FormatBool(ballot.Cast))
				bot.DB.Save(&ballot)
				println("Ballot: " + ballot.VoterId + " " + ballot.FirstChoice + " " + ballot.SecondChoice + " " + ballot.ThirdChoice)

				err := s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
					Type: discordgo.InteractionResponseChannelMessageWithSource,
					Data: &discordgo.InteractionResponseData{
						Content: "Your vote has been submitted",
						Flags:   discordgo.MessageFlagsEphemeral,
					},
				})
				if err != nil {
					log.Printf("Error responding to interaction: %v", err)
					return
				}
			}

		}
	})
}

func HandleEndPoll(s *discordgo.Session, m *discordgo.InteractionCreate) {
	bot := models.GetBot(m.GuildID)

	poll := models.GetCurrentPoll(bot.DB)
	ellibleBallots := 0

	if poll == nil {
		s.InteractionRespond(m.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Content: "No poll is currently in progress",
			},
		})
		return
	}
	for _, ballot := range poll.Ballots {
		if ballot.Cast {
			ellibleBallots++
		}
	}
	if ellibleBallots < 5 {
		s.InteractionRespond(m.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Content: "You do not have enough votes to end the poll",
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

	// Get all unused suggestions with 3+ updicks (same criteria as poll creation)
	suggestions := models.GetMostRecentUnusedSuggestions(bot.DB)

	if len(suggestions) == 0 {
		s.InteractionRespond(m.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Content: "No suggestions are currently available for polling. Suggestions need at least 3 updicks to be eligible.",
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
		if !isDuplicate && suggestion.Updicks >= 3 {
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

	responseBuilder.WriteString("\n*Suggestions need at least 3 updicks to be eligible for polls.*")

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
