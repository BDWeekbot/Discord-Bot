package models

import (
	"fmt"
	"math/rand"
	"strconv"
	"strings"

	"github.com/bwmarrin/discordgo"
	"gorm.io/gorm"
)

// Poll is a struct that represents a poll
type Poll struct {
	gorm.Model
	ID          uint `sql:"AUTO_INCREMENT" gorm:"primary_key"`
	Suggestions []Suggestion
	InProgress  bool
	IsComplete  bool
	Ballots     []Ballot `gorm:"foreignKey:PollID"`
}

// NewOrCurrentPoll creates a new poll or returns the current one
func NewOrCurrentPoll(bot *Bot) *Poll {
	poll := GetCurrentPoll(bot.DB)
	if poll != nil {
		println("Current poll found")
		return poll
	}

	suggestions := GetMostRecentUnusedSuggestions(bot.DB)
	println("Suggestions found", len(suggestions))
	if len(suggestions) < 3 {
		fmt.Println("Not enough suggestions to start poll")
		return nil
	}

	poll = &Poll{
		Suggestions: suggestions,
		InProgress:  true,
	}
	println("Creating new poll")
	bot.DB.Create(poll)
	return poll
}

// GetCurrentPoll gets the current poll from the database
func GetCurrentPoll(db *gorm.DB) *Poll {
	var poll Poll
	db.Preload("Suggestions").Preload("Ballots").Where("in_progress = ? and is_complete = ?", true, false).First(&poll)
	if poll.ID == 0 {
		fmt.Println("No current poll found")
		return nil
	}

	return &poll
}

// GetSelectOptions gets the select options for the poll
func (p *Poll) GetSelectOptions() []discordgo.SelectMenuOption {
	var options []discordgo.SelectMenuOption
	var filter []Suggestion
	for _, suggestion := range p.Suggestions {
		isDuplicate := false
		for _, f := range filter {
			if strings.EqualFold(suggestion.Content, f.Content) {
				isDuplicate = true
				break
			}
		}

		if !isDuplicate && suggestion.Updicks >= 3 {
			filter = append(filter, suggestion)
		}
	}
	// discords options limit is 25
	if len(filter) > 25 {
		filter = filter[:25]
	}
	for _, suggestion := range filter {
		options = append(options, discordgo.SelectMenuOption{
			Label:   suggestion.Content,
			Value:   suggestion.Content,
			Default: false,
			Emoji:   discordgo.ComponentEmoji{Name: "📅"},
		})
	}

	return options
}

// IsVoter checks if a user is a voter
func (p *Poll) HasBallot(voterID string) bool {
	ballots := p.GetBallots()
	for _, ballot := range ballots {
		println("Ballot VoterID "+ballot.VoterId, ballot.FirstChoice, ballot.SecondChoice, ballot.ThirdChoice, strconv.FormatBool(ballot.Cast))
		if ballot.VoterId == voterID && ballot.PollID == p.ID {
			return true
		}
	}
	println("has ballot return false")
	return false
}

func (p *Poll) BallotCast(voterID string) bool {
	var ballot Ballot
	ballots := p.GetBallots()
	for _, b := range ballots {
		if b.VoterId == voterID {
			ballot = b
			break
		}
	}
	return ballot.Cast

}

// GetBallots gets the ballots of the poll
func (p *Poll) GetBallots() []Ballot {
	return p.Ballots
}

// AddBallot adds a ballot to the poll
func (p *Poll) AddBallotToPoll(bot *Bot, ballot Ballot) {
	for index, b := range p.Ballots {
		if b.VoterId == ballot.VoterId {
			p.Ballots[index] = ballot
			break
		}
	}
	p.Ballots = append(p.Ballots, ballot)
	bot.DB.Save(&p)

}

func (p *Poll) AddBallotForVoter(bot *Bot, ballot Ballot) {
	var voter Voter
	bot.DB.Where("user_id = ?", ballot.VoterId).First(&voter)

	if voter.UserID == "" {
		// Voter does not exist, create new voter
		voter = Voter{
			UserID: ballot.VoterId,
		}
		bot.DB.Create(&voter)
		println("ABFV -- Voter created")

	}
	bot.DB.Create(&ballot)

	// Add the ballot to the poll
	println("ABFV -- Adding ballot to poll")
	p.AddBallotToPoll(bot, ballot)

}

func (p *Poll) PerformRankedChoiceVoting() string {
	voteCounts := make(map[string]int)
	totalBallots := len(p.Ballots)
	totalEligibleBallots := 0
	// Initialize vote counts for each suggestion
	for _, suggestion := range p.Suggestions {
		voteCounts[suggestion.Content] = 0
	}

	// First round: count first-choice votes
	for _, ballot := range p.Ballots {
		if !ballot.Cast {
			continue
		}
		totalEligibleBallots++
		voteCounts[ballot.FirstChoice]++
		println("FC", ballot.FirstChoice, voteCounts[ballot.FirstChoice])
	}

	// Remove suggestions that did not receive any votes in the first round
	for suggestion, count := range voteCounts {
		println("SUGGESTION COUNT", suggestion, count)
	}
	for suggestion, count := range voteCounts {
		if count == 0 {
			println("deleted: " + suggestion)
			delete(voteCounts, suggestion)
		}
	}

	if totalEligibleBallots < 4 {
		allOneVote := true
		for _, count := range voteCounts {
			if count != 1 {
				allOneVote = false
				break
			}
		}
		if allOneVote {
			// Collect all suggestions with one vote
			var oneVoteSuggestions []string
			for suggestion, count := range voteCounts {
				if count == 1 {
					oneVoteSuggestions = append(oneVoteSuggestions, suggestion)
				}
			}
			// Randomly select a winner from the suggestions with one vote
			return oneVoteSuggestions[rand.Intn(len(oneVoteSuggestions))]
		}
	}

	// Check for majority
	for {
		// Find the suggestion with the highest votes
		var maxVotes int
		var maxSuggestion string
		for suggestion, count := range voteCounts {
			if count > maxVotes {
				maxVotes = count
				maxSuggestion = suggestion
			}
		}

		// Check if the suggestion has more than 50% of the votes
		if maxVotes > (totalBallots+1)/2 {
			return maxSuggestion
		}

		// Find the suggestion with the fewest votes
		var minVotes int = totalBallots + 1
		var minSuggestion string
		for suggestion, count := range voteCounts {
			if count > 0 && count < minVotes {
				minVotes = count
				minSuggestion = suggestion
			}
		}

		// Eliminate the suggestion with the fewest votes
		delete(voteCounts, minSuggestion)

		// Redistribute votes
		for _, ballot := range p.Ballots {
			if ballot.FirstChoice == minSuggestion {
				if voteCounts[ballot.SecondChoice] > 0 {
					voteCounts[ballot.SecondChoice]++
				} else if voteCounts[ballot.ThirdChoice] > 0 {
					voteCounts[ballot.ThirdChoice]++
				}
			}
		}
	}
}

// EndPoll ends the poll
func (p *Poll) EndPoll() {
	println("Ending poll")
	p.InProgress = false
	p.IsComplete = true

	for _, suggestion := range p.Suggestions {
		suggestion.Used = true
	}
}
