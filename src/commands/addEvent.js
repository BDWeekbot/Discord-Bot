const {SlashCommandBuilder} = require("discord.js")
const {addEvent} = require("../functions/addEvent.function")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add-event")
        .setDescription("Adds an event to the server"),
    async execute(interaction, client){
        addEvent(interaction, client)
    },
}