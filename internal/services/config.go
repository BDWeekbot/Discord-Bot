package services

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DiscordToken string
}

// GetConfig returns the configuration for the bot from the environment
func GetConfig() *Config {
	godotenv.Load()
	config := Config{

		DiscordToken: os.Getenv("DISCORD_TOKEN"),
	}
	return &config
}
