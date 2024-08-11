package commands

import (
	"github.com/bwmarrin/discordgo"
)

// GetPingCommand returns the ping command
func GetPingCommand() *discordgo.ApplicationCommand {
	pingCommand := &discordgo.ApplicationCommand{
		Name:        "ping",
		Description: "Ping the bot",
		Type:        discordgo.ChatApplicationCommand,
	}
	return pingCommand
}
