import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from "discord.js";
import { changeServerName } from "../functions/changeServerName/changeServerName.js";


export default{
    data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Starts the community poll to change the guilds name"),
    async execute(interaction: ChatInputCommandInteraction, client: Client){
        let date: Date = new Date()
      
        if (date.getDay() === 0 ||date.getDay() === 1 || date.getDay() === 6){
            console.log("poll")
            //await interaction.channel?.send('Starting the 39\' 3/4\" Poll')
            changeServerName(interaction, client)
        }

        else{
            interaction.reply('Sorry, the poll is only open on Sundays, Mondays, and Thursdays')
        }
    }
}