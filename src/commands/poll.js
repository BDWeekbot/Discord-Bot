const {SlashCommandBuilder} = require("discord.js")
const {changeServerName} = require("../functions/changeServerName")
  
      



module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("runs poll to change week name"),
  async execute(interaction, client) {
    if (!interaction.user.bot) {
      let date = new Date();

      // getDay() for 0-6, getDate() 0-31
      if (date.getDay() === 0 || date.getDay() === 1) {
        //sunday = 0)

        // function interactions
        if (date.getDay() === 1) {
          console.log(date.getDay());
          interaction.reply(
            "*YAAAWN*... What? Monday? How long is a week again?"
          );
        } else {
          console.log(date.getDay());
          interaction.reply(
            "*YAAAWN*... Is it that time of the week again already?"
          );
        } // install day switch?

         
        // run poll
        changeServerName(interaction, client);
        
    
      } else {
        console.log("return trigger - wrong day - not sunday or monday");
        interaction.reply("This service only works on Sundays, Sorry");
        return;
      }
      
    }
    
  },
};


