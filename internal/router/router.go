package router

import (
	"weekbot-go/internal/commands"
	"weekbot-go/internal/handlers"
	"weekbot-go/internal/services/discord"
)

func ConfigureHandlers(dsc *discord.DiscordService) *discord.DiscordService {
	dsc.AddHandler(handlers.ParseInteraction)
	dsc.AddHandler(handlers.ParseChatCommand)
	dsc.AddHandler(handlers.HandleReactions)
	return dsc
}

func SetCommands(dsc *discord.DiscordService, guildId string) *discord.DiscordService {

	dsc.AddSlashCommand(commands.GetPingCommand(), guildId)
	dsc.AddSlashCommand(commands.GetPollCommand(), guildId)
	dsc.AddSlashCommand(commands.EndPollCommand(), guildId)

	return dsc
}
