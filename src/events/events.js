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

function eventModule(client) {

  client.on("messageCreate", (message) => {
    let date = new Date()
    // convertDate(date to redux)
    let dateCheck = convertDate(date)
    console.log(dateCheck)
  })
  // daily date check
  let fDate = new Date();
  let date = convertDate(fDate);

  console.log(date)
  console.log(fDate.toTimeString())
  function convertDate(date) {
    let month = String(date.getMonth() + 1);
    let day = String(date.getDate());
    let year = String(date.getFullYear());
    let hours = String(date.getHours());
    let seconds = String(date.getSeconds())
    

    // store in Redux 
    return { month: month, day: day, year: year, hours: hours, seconds: seconds};
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

module.exports = { eventModule };
