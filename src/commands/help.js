const {SlashCommandBuilder} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("lists all commands"),
    async execute(interaction){
        await interaction.reply("help is not available, feel free to patiently suffer.")
    },
}