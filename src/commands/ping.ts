import { SlashCommandBuilder, ChatInputCommandInteraction,Interaction, BaseInteraction, Client } from "discord.js";

export default {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Confirms Bot is online and listening"),
    async execute(interaction: ChatInputCommandInteraction, client: Client){
        await interaction.reply("pong")
    }
}