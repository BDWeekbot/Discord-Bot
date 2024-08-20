package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"weekbot-go/internal/api"
	"weekbot-go/internal/models"
	"weekbot-go/internal/router"
	"weekbot-go/internal/services"
	"weekbot-go/internal/services/discord"
)

func main() {

	config := services.GetConfig()

	discordService, err := discord.NewDiscordService(config.DiscordToken)
	if err != nil {
		fmt.Println("Error creating Discord service:", err)
		return
	}

	// Configure the handlers
	discordService = router.ConfigureHandlers(discordService)

	// Connect to Discord using the token from the config
	fmt.Println("Connecting to Discord...")
	err = discordService.Connect()
	if err != nil {
		fmt.Println("Error connecting to Discord:", err)
		return
	}

	// Create a new bot instance for each guild
	for _, guild := range discordService.GetGuilds() {
		_, err := models.NewBot(config, guild.ID)
		discordService = router.SetCommands(discordService, guild.ID)
		if err != nil {
			fmt.Println("Error creating bot:", err)
			return
		}
	}
	api.Gin(discordService)

	// Setup an interrupt listener
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	signal.Notify(stop, syscall.SIGTERM)

	// Block until we get an interrupt
	<-stop

	fmt.Println("Shutting down...")
}
