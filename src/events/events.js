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
const { User } = require("../models");

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
      console.log(date, newDate);
      console.log("same Date");
      return;
    }
    date = newDate;
    let formatDate = convertDate(date);
    console.log(formatDate);
    return formatDate;
    // users for each if birthday === formatDate  send Happy Birthday
  }

  function Birthday() {
   //console.log( typeof(date.month)) type string
    console.log("month " + date.month, "day " + date.day)
    User.find({ "birthday.month": date.month, "birthday.day": date.day}, 
      function (err, birthdays) {
        console.log(birthdays)
      if (birthdays.length > 0) {
        birthdays.forEach((user) => {
          console.log(user.birthday.month, user.birthday.day)
          console.log(`Happy Birthday @${user.user}`);
        });
      } else {
        console.log("else" + err);
        return;
      }
    });
  }

  // to do - modulate functions, gather client channel info, post to channel on birthday

  setInterval(() => {
    checkTime();
    Birthday();
  }, 4320); //  8640,0000 = 1 Day
}

module.exports = { eventModule };
