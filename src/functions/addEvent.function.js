const { Event } = require("../models");

const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events,
} = require("discord.js");

// might be easier to create web page to recieve event information

// frequency
// once, recurring etc,
// to submit event

// then go and make a function in Events that checks daily for any events logged

async function addEvent(interaction, client) {
  console.log("add event start ");
  const clientId = interaction.clientId;
  const guildId = interaction.guildId;
  const channelId = interaction.channelId;
  const channel = client.channels.cache.get(`${channelId}`);
  const guild = client.guilds.cache.get(`${guildId}`);
  const user = interaction.user.id;

  console.log(clientId)

  /*
    try {
        await Event.create({
            id: interaction.id,
            clientId: clientId, // no exist
            guildId: guildId,
            channelId: channelId, 
            name: "", 
            date: "",
            description: "",
            botText: "", //
        });
    
        console.log(`user ${user} created`);
      } catch (err) {
        console.log(err);
      }
 */
  const eventModal = new ModalBuilder()
    .setCustomId("eventModal")
    .setTitle("Event Creation");

  const eventTitle = new TextInputBuilder()
    .setCustomId("eventTitle")
    .setLabel("Event Title:")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const eventDate = new TextInputBuilder()
    .setCustomId("eventDate")
    .setLabel("Date:")
    .setValue("MM/DD/YYYY")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const eventDescription = new TextInputBuilder()
    .setCustomId("eventDescription")
    .setLabel("Event Description:")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const announcementText = new TextInputBuilder()
    .setCustomId("announcementText")
    .setLabel("Announcement Text:")
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

  const eventActionRowOne = new ActionRowBuilder().addComponents(eventTitle);
  const eventActionRowTwo = new ActionRowBuilder().addComponents(eventDate);
  const eventActionRowThree = new ActionRowBuilder().addComponents(eventDescription);
  const eventActionRowFour = new ActionRowBuilder().addComponents(announcementText);

  eventModal.addComponents(
    eventActionRowOne,
    eventActionRowTwo,
    eventActionRowThree,
    eventActionRowFour
  );

  await interaction.showModal(eventModal);

  client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isModalSubmit()) return;


    console.log("Event Modal Action");

    const title = interaction.fields.getTextInputValue("eventTitle");
    const date = interaction.fields.getTextInputValue("eventTitle");
    const description = interaction.fields.getTextInputValue("eventTitle");
    const announcementText = interaction.fields.getTextInputValue("eventTitle");


    interaction.reply(`${title} event created`);

  });
}

module.exports = { addEvent };
