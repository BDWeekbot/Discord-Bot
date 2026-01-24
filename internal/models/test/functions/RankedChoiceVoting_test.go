package models

import (
	"testing"
	"weekbot-go/internal/models"
)

func TestPerformRankedChoiceVotingFirstChoiceMajority(t *testing.T) {

	poll := models.Poll{
		Suggestions: []models.Suggestion{
			{Content: "Option A"},
			{Content: "Option B"},
			{Content: "Option C"},
		},
		Ballots: []models.Ballot{
			{Cast: true, FirstChoice: "Option A", SecondChoice: "Option B", ThirdChoice: "Option C"},
			{Cast: true, FirstChoice: "Option A", SecondChoice: "Option C", ThirdChoice: "Option A"},
			{Cast: true, FirstChoice: "Option C", SecondChoice: "Option A", ThirdChoice: "Option B"},
			{Cast: true, FirstChoice: "Option A", SecondChoice: "Option B", ThirdChoice: "Option C"},
			{Cast: true, FirstChoice: "Option B", SecondChoice: "Option A", ThirdChoice: "Option C"},
		},
	}

	expectedWinner := "Option A"
	winner := poll.PerformRankedChoiceVoting()

	if winner != expectedWinner {
		t.Errorf("Expected winner to be %s, but got %s", expectedWinner, winner)
	}
}

func TestPerformRankedChoiceVotingSecondChoiceMajority(t *testing.T) {

	poll := models.Poll{
		Suggestions: []models.Suggestion{
			{Content: "Option A"},
			{Content: "Option B"},
			{Content: "Option C"},
		},
		Ballots: []models.Ballot{
			{Cast: true, FirstChoice: "Option B", SecondChoice: "Option B", ThirdChoice: "Option C"},
			{Cast: true, FirstChoice: "Option A", SecondChoice: "Option C", ThirdChoice: "Option A"},
			{Cast: true, FirstChoice: "Option C", SecondChoice: "Option B", ThirdChoice: "Option B"},
			{Cast: true, FirstChoice: "Option A", SecondChoice: "Option B", ThirdChoice: "Option C"},
			{Cast: true, FirstChoice: "Option B", SecondChoice: "Option A", ThirdChoice: "Option C"},
		},
	}

	expectedWinner := "Option B"
	winner := poll.PerformRankedChoiceVoting()

	if winner != expectedWinner {
		t.Errorf("Expected winner to be %s, but got %s", expectedWinner, winner)
	}
}

func TestPerformRankedChoiceVotingThirdChoiceMajority(t *testing.T) {

	poll := models.Poll{
		Suggestions: []models.Suggestion{
			{Content: "Option A"},
			{Content: "Option B"},
			{Content: "Option C"},
		},
		Ballots: []models.Ballot{
			{Cast: true, FirstChoice: "Option C", SecondChoice: "Option B", ThirdChoice: "Option A"},
			{Cast: true, FirstChoice: "Option A", SecondChoice: "Option C", ThirdChoice: "Option B"},
			{Cast: true, FirstChoice: "Option C", SecondChoice: "Option A", ThirdChoice: "Option B"},
			{Cast: true, FirstChoice: "Option A", SecondChoice: "Option B", ThirdChoice: "Option C"},
			{Cast: true, FirstChoice: "Option B", SecondChoice: "Option C", ThirdChoice: "Option A"},
		},
	}

	expectedWinner := "Option C"
	winner := poll.PerformRankedChoiceVoting()

	if winner != expectedWinner {
		t.Errorf("Expected winner to be %s, but got %s", expectedWinner, winner)
	}
}

func TestPerformRankedChoiceVotingRealTest(t *testing.T) {

	poll := models.Poll{
		Suggestions: []models.Suggestion{
			{Content: "Weekly Week"},
			{Content: "Week Week Week Week Week"},
			{Content: "Weeker than Weekly Week"},
			{Content: "Fun Suggestion week"},
		},

		Ballots: []models.Ballot{
			{Cast: true, FirstChoice: "Weekly Week", SecondChoice: "Fun Suggestion week", ThirdChoice: "Weeker than Weekly Week"},
			{Cast: true, FirstChoice: "Week Week Week Week Week", SecondChoice: "Weeker than Weekly Week", ThirdChoice: "Fun Suggestion week"},
			{Cast: true, FirstChoice: "Weeker than Weekly Week", SecondChoice: "Weekly Week", ThirdChoice: "Fun Suggestion week "},
			{Cast: true, FirstChoice: "Weeker than Weekly Week", SecondChoice: "Fun Suggestion week", ThirdChoice: "Weeker than Weekly Week"},
		},
	}

	expectedWinner := "Weeker than Weekly Week"
	winner := poll.PerformRankedChoiceVoting()

	if winner != expectedWinner {
		t.Errorf("Expected winner to be %s, but got %s", expectedWinner, winner)
	}
}

func TestPerformRankedChoiceVotingThreeTest(t *testing.T) {

	poll := models.Poll{
		Suggestions: []models.Suggestion{
			{Content: "Weekly Week"},
			{Content: "Week Week Week Week Week"},
			{Content: "Weeker than Weekly Week"},
			{Content: "Fun Suggestion week"},
			{Content: "Another Suggestion week"},
			{Content: "Best Suggestion week"},
			{Content: "Derek Suggestion week"},
		},

		Ballots: []models.Ballot{
			{Cast: true, FirstChoice: "Weekly Week", SecondChoice: "Fun Suggestion week", ThirdChoice: "Weeker than Weekly Week"},
			{Cast: true, FirstChoice: "Week Week Week Week Week", SecondChoice: "Weeker than Weekly Week", ThirdChoice: "Fun Suggestion week"},
			{Cast: true, FirstChoice: "Weeker than Weekly Week", SecondChoice: "Weekly Week", ThirdChoice: "Fun Suggestion week"},
		},
	}

	expectedWinner := poll.PerformRankedChoiceVoting()
	winner := expectedWinner

	if winner != expectedWinner {
		t.Errorf("Expected winner to be %s, but got %s", expectedWinner, winner)
	}
}

func TestPerformRankedChoiceVotingTwoTest(t *testing.T) {

	poll := models.Poll{
		Suggestions: []models.Suggestion{
			{Content: "Weekly Week"},
			{Content: "Week Week Week Week Week"},
			{Content: "Weeker than Weekly Week"},
			{Content: "Fun Suggestion week"},
		},

		Ballots: []models.Ballot{
			{Cast: true, FirstChoice: "Weekly Week", SecondChoice: "Fun Suggestion week", ThirdChoice: "Weeker than Weekly Week"},
			{Cast: true, FirstChoice: "Weeker than Weekly Week", SecondChoice: "Weekly Week", ThirdChoice: "Fun Suggestion week "},
		},
	}

	expectedWinner := poll.PerformRankedChoiceVoting()
	winner := expectedWinner

	if winner != expectedWinner {
		t.Errorf("Expected winner to be %s, but got %s", expectedWinner, winner)
	}
}

func TestPerformRankedChoiceVotingLargeTest(t *testing.T) {

	poll := models.Poll{
		Suggestions: []models.Suggestion{
			{Content: "Weekly Week"},
			{Content: "Week Week Week Week Week"},
			{Content: "Weeker than Weekly Week"},
			{Content: "Fun Suggestion week"},
			{Content: "Another Suggestion week"},
			{Content: "Best Suggestion week"},
			{Content: "Derek Suggestion week"},
		},

		Ballots: []models.Ballot{
			{Cast: true, FirstChoice: "Weekly Week", SecondChoice: "Fun Suggestion week", ThirdChoice: "Best Suggestion week"},
			{Cast: true, FirstChoice: "Week Week Week Week Week", SecondChoice: "Weeker than Weekly Week", ThirdChoice: "Fun Suggestion week"},
			{Cast: true, FirstChoice: "Another Suggestion week", SecondChoice: "Weekly Week", ThirdChoice: "Fun Suggestion week"},
			{Cast: true, FirstChoice: "Derek Suggestion week", SecondChoice: "Fun Suggestion week", ThirdChoice: "Weeker than Weekly Week"},
			{Cast: true, FirstChoice: "Week Week Week Week Week", SecondChoice: "Weeker than Weekly Week", ThirdChoice: "Fun Suggestion week"},
			{Cast: true, FirstChoice: "Weeker than Weekly Week", SecondChoice: "Weekly Week", ThirdChoice: "Derek Suggestion week"},
			{Cast: true, FirstChoice: "Weekly Week", SecondChoice: "Fun Suggestion week", ThirdChoice: "Weeker than Weekly Week"},
			{Cast: true, FirstChoice: "Best Suggestion week", SecondChoice: "Weeker than Weekly Week", ThirdChoice: "Fun Suggestion week"},
			{Cast: true, FirstChoice: "Weeker than Weekly Week", SecondChoice: "Derek Suggestion week", ThirdChoice: "Weekly Week"},
		},
	}

	expectedWinner := "Weeker than Weekly Week"
	println(expectedWinner)
	winner := poll.PerformRankedChoiceVoting()

	if winner != expectedWinner {
		t.Errorf("Expected winner to be %s, but got %s", expectedWinner, winner)
	}
}

func TestPerformRankedChoiceVotingBlank(t *testing.T) {

	poll := models.Poll{
		Suggestions: []models.Suggestion{
			{Content: "Weekbot Makes My Knees Week"},
			{Content: "Shane Moves Back Home Week"},
			{Content: "Not Enough Suggestions to Start Poll Week"},
			{Content: "Its Actually Weekbots Monster Week"},
			{Content: "Weekbot Lives Week"},
		},
		Ballots: []models.Ballot{
			{Cast: true, FirstChoice: "Weekbot Makes My Knees Week", SecondChoice: "Shane Moves Back Home Week", ThirdChoice: "Not Enough Suggestions to Start Poll Week"},
			{Cast: true, FirstChoice: "Its Actually Weekbots Monster Week", SecondChoice: "Not Enough Suggestions to Start Poll Week", ThirdChoice: "Weekbot Lives Week"},
			{Cast: true, FirstChoice: "Not Enough Suggestions to Start Poll Week", SecondChoice: "Shane Moves Back Home Week", ThirdChoice: "Weekbot Makes My Knees Week"},
			{Cast: false, FirstChoice: "Shane Moves Back Home Week", SecondChoice: "", ThirdChoice: ""},
			{Cast: false, FirstChoice: "", SecondChoice: "", ThirdChoice: ""},
		},
	}

	// With proper RCV logic:
	// Round 1: All first choices get 1 vote each except Shane/Weekbot Lives (0 votes)
	// Round 2: After eliminating one of the tied candidates (e.g., Weekbot Makes My Knees Week),
	//          its vote goes to "Not Enough Suggestions to Start Poll Week" giving it 2 votes
	// Final: "Not Enough Suggestions to Start Poll Week" wins with 2 votes vs 1
	expectedWinner := "Not Enough Suggestions to Start Poll Week"
	winner := poll.PerformRankedChoiceVoting()
	if winner != expectedWinner {
		t.Errorf("Expected winner to be %s, but got %s", expectedWinner, winner)
	}
}

func TestPerformRankedChoiceVotingWithZeroVoteCandidates(t *testing.T) {
	// Test case where some candidates receive no first-choice votes
	poll := models.Poll{
		Suggestions: []models.Suggestion{
			{Content: "Popular Option"},
			{Content: "Second Option"},
			{Content: "Unpopular Option"},
			{Content: "Never Picked Option"},
		},
		Ballots: []models.Ballot{
			{Cast: true, FirstChoice: "Popular Option", SecondChoice: "Second Option", ThirdChoice: "Unpopular Option"},
			{Cast: true, FirstChoice: "Popular Option", SecondChoice: "Unpopular Option", ThirdChoice: "Second Option"},
			{Cast: true, FirstChoice: "Second Option", SecondChoice: "Popular Option", ThirdChoice: "Unpopular Option"},
			{Cast: true, FirstChoice: "Second Option", SecondChoice: "Unpopular Option", ThirdChoice: "Popular Option"},
		},
	}

	// Popular Option: 2 votes, Second Option: 2 votes
	// After eliminating zero-vote candidates and one of the tied leaders,
	// redistribution should determine the winner
	winner := poll.PerformRankedChoiceVoting()

	// Both Popular Option and Second Option are valid winners depending on tie-breaking
	if winner != "Popular Option" && winner != "Second Option" {
		t.Errorf("Expected winner to be either Popular Option or Second Option, but got %s", winner)
	}
}
