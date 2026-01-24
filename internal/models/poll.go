package models

import (
	"fmt"
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

	suggestions := GetMostRecentUnusedSuggestionsForGuild(bot.DB, bot.GuildID)
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
		// Skip suggestions with empty or invalid content (Discord requires 1-100 chars)
		content := strings.TrimSpace(suggestion.Content)
		if content == "" || len(content) > 100 {
			continue
		}

		isDuplicate := false
		for _, f := range filter {
			if strings.EqualFold(content, f.Content) {
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
	found := false
	for index, b := range p.Ballots {
		if b.VoterId == ballot.VoterId {
			p.Ballots[index] = ballot
			found = true
			break
		}
	}
	if !found {
		p.Ballots = append(p.Ballots, ballot)
	}
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
	// Track which candidates are still active
	activeCandidates := make(map[string]bool)
	for _, suggestion := range p.Suggestions {
		activeCandidates[suggestion.Content] = true
	}

	// Count only eligible ballots
	var eligibleBallots []Ballot
	for _, ballot := range p.Ballots {
		if ballot.Cast {
			eligibleBallots = append(eligibleBallots, ballot)
		}
	}

	totalEligibleBallots := len(eligibleBallots)

	// Perform rounds of voting
	for len(activeCandidates) > 1 {
		// Count current round votes
		voteCounts := make(map[string]int)
		for candidate := range activeCandidates {
			voteCounts[candidate] = 0
		}

		// Count votes based on current active preferences
		for _, ballot := range eligibleBallots {
			currentChoice := p.getCurrentChoice(ballot, activeCandidates)
			if currentChoice != "" {
				voteCounts[currentChoice]++
			}
		}

		// Check for majority (more than 50%)
		for candidate, count := range voteCounts {
			if count > totalEligibleBallots/2 {
				return candidate
			}
		}

		// Find candidate(s) with fewest votes to eliminate
		minVotes := totalEligibleBallots + 1
		for _, count := range voteCounts {
			if count < minVotes {
				minVotes = count
			}
		}

		// Eliminate candidate with fewest votes (tie-breaking: first found)
		for candidate, count := range voteCounts {
			if count == minVotes {
				delete(activeCandidates, candidate)
				break
			}
		}
	}

	// Return the last remaining candidate
	for candidate := range activeCandidates {
		return candidate
	}

	return ""
}

// getCurrentChoice returns the highest-ranked choice that's still active
func (p *Poll) getCurrentChoice(ballot Ballot, activeCandidates map[string]bool) string {
	choices := []string{ballot.FirstChoice, ballot.SecondChoice, ballot.ThirdChoice}
	for _, choice := range choices {
		if choice != "" && activeCandidates[choice] {
			return choice
		}
	}
	return "" // Exhausted ballot
}

// EndPoll ends the poll
func (p *Poll) EndPoll() {
	println("Ending poll")
	p.InProgress = false
	p.IsComplete = true
}
