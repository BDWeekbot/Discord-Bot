const { Event } = require("../models");

const {
  EmbedBuilder
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
  const userUsername = interaction.user.username


  const title = interaction.options.getString('title')
  const time = interaction.options.getString('time')
  const date = interaction.options.getString('date')
  const frequency = interaction.options.getString('frequency')
  const description = interaction.options.getString('description')
  let  announcement = interaction.options.getString('announcement')



  try {
    await Event.create({
        _id: interaction.id, 
        rsvp: [],
        guildId: guildId,
        channelId: channelId, 
        name: title, 
        date: date,
        time: time,
        description: description,
        botText: announcement, 
    });

      // rsvp members by react ---- update array of user id's - edit embed with a list of rsvp'd members ?

    console.log(`user ${user} created ${title} event`);
  } catch (err) {
    console.log("Mongo Event Submit Error: " , err);
  }

  if(announcement === null){
    announcement = description
  }

  console.log(title, time, frequency, description, announcement)
  
  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(title)
    //.setURL('https://discord.js.org/')
    .setAuthor({ name: userUsername })
    .setDescription(description)
    .setThumbnail('https://i.imgur.com/AfFp7pu.png')
    .addFields(
      {name: "date", value: date},
      { name: '\u200B', value: '\u200B' },
      { name: 'time', value: time },
      { name: '\u200B', value: '\u200B' },
      { name: "frequency", value: frequency, inline: true },
      { name: ' ', value: announcement, inline: true },
    )
    .setImage('https://i.imgur.com/AfFp7pu.png')
    .setTimestamp()
    .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

     
   
 
 
      channel.send({ embeds: [embed] });
      
}

module.exports = { addEvent };
