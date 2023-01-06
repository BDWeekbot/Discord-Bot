const {SlashCommandBuilder} = require("discord.js")
const {newUser} = require("../functions/newUser")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user-info")
        .setDescription("adds or updates user in the Weekbot Database"),
    async execute(interaction, client){
      newUser(interaction, client)

     // console.log(interaction)
    },
}