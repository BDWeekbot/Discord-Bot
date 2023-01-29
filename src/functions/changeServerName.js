const { Archive, Message } = require("../models");

function changeServerName(interaction, client) {
  const guildId = interaction.guildId;
  const channelId = interaction.channelId;
  const channel = client.channels.cache.get(`${channelId}`);
  const guild = client.guilds.cache.get(`${guildId}`);

  //console.log(interaction)
  //console.log(channel)
  console.log(guild);
  channel.send(
    "Well anyway....Here's your poll for this week... The first week below to reach 4 votes wins"
  );
  /// here we create a button or modal for each option
  

  try {
    Message.find({ votes: { $gte: 3 } }, function (err, messages) {
      /////////////////// Change to 3
      if (err) {
        console.log(err);
      } else {
        messages.forEach((item) => {
          channel.send(item.content);

          Archive.create({
            _id: item.id, //.id
            channelID: item.channelId, // .channelId
            votes: item.votes,
            content: item.content, // .content
            sender: item.id, // .username
          });
        });
      }
    });
  } catch (err) {
    console.log(err);
  }

  client.on("messageReactionAdd", async (reaction) => {
    await reaction.fetch();
    if (
      reaction.count === 4 &&
      reaction.emoji.name === "bd" &&
      reaction.message.author.bot
    ) {
      /////////////////// Change to 4
      //"bd" for server / "🤙" for test
      let newName = reaction.message.content;

      try {
        channel.send(newName + " is the new week name!");
        await guild.setName(newName); // will fail if manage server permission isnt avail
        // await message.guild.setBanner(./banner.png) //recieves auto generated image

        client.off("messageReactionAdd", (reaction) => {
          console.log("Message Reaction Event Listener - Off");
          console.log(reaction);
        });
      } catch (err) {
        console.log(err);
      }

      setTimeout(() => {
        channel.send(
          "Hello, I am now accepting suggestions for next weeks name"
        );
        channel.send(
          "Your suggestion must end in 'week' and must recieve at least 3 reacts to be entered into the next Poll"
        );
        channel.send("Good Luck! ");
      }, "1000");

      try {
        Message.deleteMany({ votes: { $gte: 0 } }, function (err, messages) {
          if (err) {
            console.log(err);
          } else {
            console.log(messages);
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  });
}

// function changeChannelName(message, client) {
//   const guildID = message.guildId
//   const channelID = message.channelId

//   console.log(message.guild.channels.find("name", "project"))
// }

module.exports = { changeServerName };
