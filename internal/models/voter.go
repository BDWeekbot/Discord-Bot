package models

import (
	"gorm.io/gorm"
)

type Voter struct {
	gorm.Model
	UserID  string
	Ballots []Ballot `gorm:"foreignKey:VoterId"`
}
