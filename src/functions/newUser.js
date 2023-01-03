const { User } = require("../models");


async function newUser(interaction, client) {

  console.log("new user start");

  const guildId = interaction.guildId
  const channelId = interaction.channelId
  const channel = client.channels.cache.get(`${channelId}`)
  const guild = client.guilds.cache.get(`${guildId}`)
  const user = interaction.user.id;
  

  
  
  try {
    await User.create({
      _id: user, //.id
      user: user,
      name: "", //.id
      birthday: "", //
    });

    console.log(`user ${user} created`);
  } catch (err) {
    console.log(err);
  }

  const filter = (m) => m.author.id === user;

  channel.send("What is your name?");
  channel
    .awaitMessages({ filter: filter, max: 1, time: 60000 })
    .then((collected) => {
      console.log(collected.first().content);
      let fName = collected.first().content;

      User.findByIdAndUpdate(user, { name: fName }, function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated Message : ", docs);
        }
      });
    })
    .catch((error) => {
      console.log("Catch exec");
      console.log(error);
    })
      .then(() => {
        channel.send("When is your Birthday (mm/dd/yyyy)?");
        channel
          .awaitMessages({ filter: filter, max: 1, time: 60000 })
          .then((collected) => {
            console.log(collected.first().content);
            let birthday = collected.first().content;
            let bdaySplit = birthday.split("/");

            User.findByIdAndUpdate(
              user,
              {
                birthday: {
                  month: bdaySplit[0],
                  day: bdaySplit[1],
                  year: bdaySplit[2],
                },
              },
              function (err, docs) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Updated Message : ", docs);
                }
              }
            );
          })
          .catch((error) => {
            console.log("Catch exec");
            console.log(error);
          })
          .then(() => {
            channel.send(
              `Thanks ${interaction.user.username}, your data is now being collected and sold to big business. We're watching your every move.`
            );
          });
      
    });
    
}

/*
       _id: user, //.id
        user: user,
        name: fName, //.id
        birthday: birthday, // 
       */

module.exports = { newUser };
