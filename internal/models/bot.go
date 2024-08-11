package models

import (
	"fmt"
	"weekbot-go/internal/services"

	"gorm.io/gorm"
)

var botInstances = make(map[string]*Bot)

// Holder of all basic state for each bot instance.
type Bot struct {
	GuildID string
	Config  *services.Config
	DB      *gorm.DB
}

func NewBot(config *services.Config, gid string) (*Bot, error) {
	db, err := services.GetDB(gid)
	if err != nil {
		return nil, err
	}

	bot := &Bot{
		Config:  config,
		GuildID: gid,
		DB:      db,
	}

	configureSchema(db)

	botInstances[gid] = bot

	fmt.Println("Connected to guild", gid)

	return bot, nil
}

func GetBot(guildID string) *Bot {
	return botInstances[guildID]
}

func GetBotInstances() map[string]*Bot {
	return botInstances
}

func configureSchema(db *gorm.DB) {
	db.AutoMigrate(&Suggestion{})
	db.AutoMigrate(&Poll{})
	db.AutoMigrate(&Voter{})
	db.AutoMigrate(&Ballot{})
}
