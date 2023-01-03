const {SlashCommandBuilder} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Confirms bot is online and listening"),
    async execute(interaction){
        await interaction.reply("pong")
    },
}