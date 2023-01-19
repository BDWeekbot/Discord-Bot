const {Message} = require("../models");
const {filterRepeatContent} = require("../functions/new-message")

function WeekListener(client){
    client.on("messageCreate", (message) => {

        console.log(message)
      
        const msgArray = message.content.split(" ");
        if (message.channel.name === "week-name" && !message.author.bot) {
          if (msgArray[msgArray.length - 1].toLowerCase() === "week") {
            filterRepeatContent(message);
          }
        } else {
          console.log("return trigger - message creation");
          return;
        }
      });
      
      // message reaction stream check
      
      client.on("messageReactionAdd", async (reaction, user) => {
        await reaction.fetch();
        if (
          reaction.message.channel.name === "week-name" &&
          !reaction.message.author.bot
        ) {
          var user_id = reaction.message.id;
          Message.findByIdAndUpdate(
            user_id,
            { votes: reaction.count },
            function (err, docs) {
              if (err) {
                console.log(err);
              } else {
                console.log("Updated Message : ", docs);
              }
            }
          );
      
          if (reaction.count === 3) {
            /////////////////// Change to 3
            reaction.message.channel.send(
              `${reaction.message.content} has been added to the poll`
            );
          }
        } else {
          console.log("trigger return - message reaction");
          return;
        }
      });
}

module.exports = {WeekListener}