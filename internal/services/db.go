package services

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func GetDB(gid string) (*gorm.DB, error) {
	gdbName := gid + ".db"
	db, err := gorm.Open(sqlite.Open(gdbName), &gorm.Config{})

	if err != nil {
		return nil, err
	}

	return db, nil
}
