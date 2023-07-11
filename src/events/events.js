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
const { convertDate } = require("../functions/convertDate");
const { store, dates } = require("../store/store");

function eventModule(client) {
  client.on("messageCreate", (message) => {
    console.log("DateTime Update");
    store.dispatch(dates());
  });

  // // daily date check
  // let fDate = new Date();
  // let date = convertDate(fDate);

  // console.log(date)
  // console.log(fDate.toTimeString())

  // function checkTime() {
  //   let newDateF = new Date();
  //   let newDate = convertDate(newDateF);
  //   if (date.month === newDate.month && date.day === newDate.day) {
  //     return;
  //   }
  //   date = newDate;
  //   let formatDate = convertDate(date);
  //   return formatDate;

  // }
  /// use state management to keep a local cache of events that updates every time an interaction occurs - if event today - set time checker

  // search db events for date - time that matches current date time, post event -Delete: once: delete event, Update: daily: day+1, weekly: day+7 (wrap 30), monthly: month +1 yearly: year + 1

  // to do - modulate functions, gather client channel info, post to channel on birthday

  // search mongo for events, if no events today set interval time to 1 day, if event today, set interval check to 1 hour until

  // setInterval(() => {

  //   checkTime();
  //   Birthday(date);
  // }, 30000);
  //  //  8640,0000 = 1 Day
}

module.exports = { eventModule, convertDate };
