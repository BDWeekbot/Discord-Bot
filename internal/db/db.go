package db

import (
	"fmt"
	"weekbot-go/internal/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func GetDB(gid string) (*gorm.DB, error) {
	gdbName := gid + ".db"
	db, err := gorm.Open(sqlite.Open(gdbName), &gorm.Config{})

	if err != nil {
		return nil, err
	}
	err = db.AutoMigrate(&models.Suggestion{}, &models.Ballot{}, &models.Voter{}, &models.Poll{})
	if err != nil {
		return nil, err
	}
	var hasTable bool
	hasTable = db.Migrator().HasTable(&models.Suggestion{})
	if !hasTable {
		return nil, fmt.Errorf("suggestions table does not exist")
	}
	hasTable = db.Migrator().HasTable(&models.Ballot{})
	if !hasTable {
		return nil, fmt.Errorf("ballots table does not exist")
	}
	hasTable = db.Migrator().HasTable(&models.Voter{})
	if !hasTable {
		return nil, fmt.Errorf("voters table does not exist")
	}
	hasTable = db.Migrator().HasTable(&models.Poll{})
	if !hasTable {
		return nil, fmt.Errorf("polls table does not exist")
	}
	return db, nil
}

func GetCurrentSuggestions(guildId string) ([]models.Suggestion, error) {
	db, err := GetDB(guildId)
	if err != nil {
		return nil, err
	}

	var suggestions []models.Suggestion
	db.Where("guild_id = ?", guildId).Find(&suggestions, "Updicks > 3")

	return suggestions, nil
}

func GetAllSuggestions(guildId string) ([]models.Suggestion, error) {
	println("Getting all suggestions")
	db, err := GetDB(guildId)
	if err != nil {
		println("Error getting db")
		return nil, err
	}

	var suggestions []models.Suggestion
	db.Where("guild_id = ?", guildId).Find(&suggestions, "Updicks >= 0")

	return suggestions, nil
}

func GetTables(guildId string) ([]string, error) {
	db, err := GetDB(guildId)
	if err != nil {
		return nil, err
	}

	var tables []string
	db.Raw("SELECT name FROM sqlite_master WHERE type='table';").Scan(&tables)

	return tables, nil
}
