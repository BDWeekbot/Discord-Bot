const {
  Client,
  Collection,
  GatewayIntentBits,
  messageLink,
  CommandInteractionOptionResolver,
  MessageReaction,
  Partials,
  Guild,
  DefaultRestOptions,
  UserFlags,
} = require("discord.js");
const {Birthday} = require("../functions/birthday")

function eventModule() {
  // daily date check
  let fDate = new Date();
  let date = convertDate(fDate);

  function convertDate(date) {
    let month = String(date.getMonth() + 1);
    let day = String(date.getDate());
    let year = String(date.getFullYear());

    //return (`${month}/${day}/${year}`)
    return { month: month, day: day, year: year };
  }

  function checkTime() {
    let newDateF = new Date();
    let newDate = convertDate(newDateF);
    if (date.month === newDate.month && date.day === newDate.day) {
      return;
    }
    date = newDate;
    let formatDate = convertDate(date);
    return formatDate;
    
  }



  // to do - modulate functions, gather client channel info, post to channel on birthday

  setInterval(() => {
    checkTime();
    Birthday(date);
  }, 43200000); //  8640,0000 = 1 Day
}

module.exports = { eventModule };
