import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from "discord.js";
import { changeServerName } from "../functions/changeServerName/changeServerName.js";
import { Message } from "../utils/models.js";


async function getPollOptions() {
  let pollOptions = new Array()

  try {
    console.log("getPollOptions")
    await Message.find()
      .where("votes")
      .gte(0)
      .then(function (messages) {
        messages.forEach((message) => {
          pollOptions.push(message);
        });
      });
  } catch (err) {
    console.log(err)
  }

  return pollOptions;
}

export default {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Starts the community poll to change the guilds name"),
  async execute(interaction: ChatInputCommandInteraction, client: Client) {
    let date: Date = new Date()
    let pollOptions = await getPollOptions()

    if (date.getDay() === 0 || date.getDay() === 1 || date.getDay() === 6) {
      console.log("poll")
      await interaction.channel?.send('Starting the 39\' 3/4\" Poll')
      await interaction.channel?.send('The Poll will be open for 24 hours')
      changeServerName(interaction, client, pollOptions)
    } else {
      interaction.reply('Sorry, the poll is only open on Sundays, Mondays, and Thursdays')
    }
  }
}