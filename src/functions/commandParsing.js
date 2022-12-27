const {changeServerName} = require("./poll");
const {eventModule} = require("../events/events");
const {newUser} = require("./newUser");
const { filterRepeatContent } = require("./new-message");
const prefix = ">";



function commandList(message){
  let cmdList = [{name: ">weekbot", description: ": It's Week Bot Everybody!"}, // ignores you because he is one with time and time is only a concept
                 {name: ">ping", description: ": replies with pong; check for live bot"},
                 {name: ">date", description: ": replies with todays date"},
                 {name: ">help", description: ": lists all available commands"},
                 {name: ">new-week", description: ": starts the weekly poll to change the week name"}
                ];
  message.channel.send("All Commands Start with '>'");
  cmdList.forEach(item => {
    message.channel.send(item.name + item.description)
  })
}

function parseWeekbotCommand(msg){
 // reads prefix commands and no response to own message
 if (!msg.content.startsWith(prefix) || msg.author.bot) return;

 //cuts prefix out of parsing
 const args = msg.content.slice(prefix.length).split(/ +/);
 const command = args.shift().toLowerCase();

 /// Message Array
 const msgArray = msg.content.split(" ");
 const argument = msgArray.slice(1);
 const cmd = msgArray[0];

  if (command === "weekbot"){
    msg.channel.send("*Week Bot has acknowledged your attempt to attract its attention*");
    msg.channel.send("*Week Bot has chosen not to dignify your attempt with a response*");
    msg.channel.send("*Week Bot Caws and Flys off into the distance*")
  }

  if (command === "ping") {
    msg.channel.send("pong");
  }
  //

  if (command === "help" || command === "list") {
    msg.channel.send("Welcome to Week Bot");
    commandList(msg);
  }

  //

  if (command === "date") {
    let date = new Date();
    msg.channel.send("today is " + date);
  }

  if (command === "newuser"){
   
    newUser(msg)
  }

  // run poll for new week command
  // poll functions
  if (command === "pun-roll"){
    runPoll(msg);
  }

  // new week is the poll
  if (command === "newweek") {
    let date = new Date();

    // getDay() for 0-6, getDate() 0-31
    if (date.getDay() === 0 || date.getDay() === 1) {
      //sunday = 0)
     

      // function interactions
      if (date.getDay() === 1) {
        console.log(date.getDate()); // This hasnt worked yet
        msg.channel.send("*YAAAWN*... What? Monday? How long is a week again?");
      } else {
        console.log(date.getDay());
        msg.channel.send(
          "*YAAAWN*... Is it that time of the week again already?"
        );
      } // install day switch?

      // run poll
      runPoll(msg);

      // HERE: Delete all messages from last week
    } else {
      console.log("return trigger - wrong day - not sunday or monday")
      msg.channel.send("This service only works on Sundays, Sorry");
      return
    }
  }

  if (command === "event"){
    console.log("Event Module")
    eventModule();
  }
}

module.exports = {parseWeekbotCommand}