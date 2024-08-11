package discord

import (
	"fmt"
	"os"

	"github.com/bwmarrin/discordgo"
)

var discordConnection *DiscordService

// DiscordService is your primary interface to Discord from the bot
type DiscordService struct {
	session *discordgo.Session
}

func NewDiscordService(token string) (*DiscordService, error) {
	// Check if we already have an instance
	if discordConnection != nil {
		return discordConnection, nil
	}
	session, err := discordgo.New("Bot " + token)
	if err != nil {
		return nil, err
	}

	session.AddHandler(func(s *discordgo.Session, m *discordgo.Ready) {
		fmt.Println("Connected to Discord as", m.User.Username)
		fmt.Println("Invite URL: https://discordapp.com/oauth2/authorize?client_id=" + m.User.ID + "&scope=bot&permissions=0")
		fmt.Println("Currently on", len(m.Guilds), "servers")
	})

	discordConnection = &DiscordService{session}

	return discordConnection, nil
}

func GetDiscordService() (*DiscordService, error) {
	if discordConnection == nil {
		return nil, fmt.Errorf("discord service not initialized")
	}
	return discordConnection, nil
}

// Connect connects to Discord
func (d *DiscordService) Connect() error {
	return d.session.Open()
}

// Disconnect disconnects from Discord
func (d *DiscordService) Disconnect() error {
	return d.session.Close()
}

// AddHandler adds a handler to the Discord session
func (d *DiscordService) AddHandler(handler interface{}) {
	d.session.AddHandler(handler)
}

// AddSlashCommand adds a slash command to the Discord session
func (d *DiscordService) AddSlashCommand(command *discordgo.ApplicationCommand, guildID string) error {
	_, err := d.session.ApplicationCommandCreate(os.Getenv("APP_ID"), guildID, command)
	return err
}

// SendMessage sends a message to a channel
func (d *DiscordService) SendMessage(channelID, message string) error {
	_, err := d.session.ChannelMessageSend(channelID, message)
	return err
}

// Connected returns true if the bot is connected to Discord
func (d *DiscordService) Connected() bool {
	return d.session.State != nil && d.session.State.User != nil
}

// GetGuilds returns the guilds the bot is on
func (d *DiscordService) GetGuilds() []*discordgo.Guild {
	return d.session.State.Guilds
}
