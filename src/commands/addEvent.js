const { SlashCommandBuilder } = require("discord.js");
const { addEvent } = require("../functions/addEvent.function");
const { timeObjectArray } = require("../objects/time.object");

let timeArray = timeObjectArray;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-event")
    .setDescription("Adds an event to the server")
    .addStringOption((option) =>
      option.setName("title")
      .setDescription("Title of Event")
      .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("MM/DD/YYYY")
        .setRequired(true))
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("Time of Event")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption((option) =>
      option
        .setName("frequency")
        .setDescription("how often the event happens")
        .setRequired(true)
        .addChoices(
          { name: "Once", value: "Once" },
          { name: "Daily", value: "Daily" },
          { name: "Weekly", value: "Weekly" },
          { name: "Monthly", value: "Monthly" },
          { name: "Annually", value: "Annually" },
        )
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("about the event")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("announcement")
        .setDescription("how weekbot announces the event")
    ),
  async autocomplete(interaction) {
    console.log(interaction);
    const focusedValue = interaction.options.getFocused();
    const choices = timeArray;
   
    let filtered = choices.filter((choice) =>
      choice.name.includes(focusedValue)
    );
    if(filtered.length > 24){
      let sliceNum = filtered.length - 24
      filtered = filtered.slice(sliceNum)
    }
    await interaction.respond(
      filtered.map((choice) => ({ name: choice.name, value: choice.value }))
    );
  },

  // title date time description annoucnement
  // translate data to an embed builder
  async execute(interaction, client) {
      addEvent(interaction, client);
     // interaction.reply(`${interaction.user.username} created event`)

     
  },
};
