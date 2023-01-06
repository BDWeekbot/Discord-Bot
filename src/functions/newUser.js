const { User } = require("../models");
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, Events} = require("discord.js")

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

 
const modal = new ModalBuilder()
.setCustomId("userModal")
.setTitle("User Info")

const nameInput = new TextInputBuilder()
  .setCustomId("nameInput")
  .setLabel("What is your name?")
  .setStyle(TextInputStyle.Short)
  .setRequired(true)

const bdayInput = new TextInputBuilder()
  .setCustomId("birthdayInput")
  .setLabel("When is your birthday")
  .setValue("mm/dd/yyyy")
  .setStyle(TextInputStyle.Short)
  .setRequired(true)

const firstActionRow = new ActionRowBuilder().addComponents(nameInput)
const secondActionRow = new ActionRowBuilder().addComponents(bdayInput)


modal.addComponents(firstActionRow, secondActionRow)

await interaction.showModal(modal)

client.on(Events.InteractionCreate, interaction => {
  
  if (!interaction.isModalSubmit()) return;
    console.log("modal submit running")
    const name = interaction.fields.getTextInputValue("nameInput")
    const birthday = interaction.fields.getTextInputValue("birthdayInput")

    console.log(name, birthday)
    let bdaySplit = birthday.split("/");

    try{
      User.findByIdAndUpdate(
        user,
        { name: name,
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
      )
    } catch(error){
      console.log(error)
    }

    interaction.reply("thanks for submitting your info")
})

}

/*
       _id: user, //.id
        user: user,
        name: fName, //.id
        birthday: birthday, // 




       */

module.exports = { newUser };








