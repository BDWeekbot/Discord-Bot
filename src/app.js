const botID = "<@1017092115987169390>";

// poll array
let oldPoll = [];
let pollArr = ["Bdons New Treehouse"];

// load discord.js
const {
  Client,
  Collection,
  GatewayIntentBits,
  messageLink,
  CommandInteractionOptionResolver,
  MessageReaction,
  Partials,
  Guild,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// load .env for keys
require("dotenv").config();
// if run from src folder require("dotenv").config({path:"../.env"})

// connection confirmation
client.on("ready", function () {
  console.log("Connected as " + client.user.tag);
  client.user.setActivity("DEREK", { type: "WATCHING" });
});

// prefix for commands
const prefix = ">";

// command response
client.on("messageCreate", (msg) => {
  // reads prefix commands and no response to own message
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  //cuts prefix out of parsing
  const args = msg.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  /// Message Array
  const msgArray = msg.content.split(" ");
  const argument = msgArray.slice(1);
  const cmd = msgArray[0];

  /////// Commands

  // test command

  if (command === "ping") {
    msg.channel.send("pong");
  }
  //

  if (command === "help" || command === "list") {
    msg.channel.send("No Help Yet");
  }

  //

  if (command === "date") {
    let date = new Date();
    msg.channel.send("today is " + date);
  }

  //

  // run poll for new week command
  if (command === "new-week") {
    let date = new Date();
    // getDay() for 0-6, getDate() 0-31
    if (date.getDay() === 0) {
      //sunday = 0)

      // check for repeat suggestions
      oldPoll.forEach(function (item) {
        if (pollArr.includes(item)) {
          pollArr.splice(pollArr.indexOf(item), 1);
          msg.channel.send(
            item +
              " has been removed from the poll because it was used last week"
          );
        }
      });

      // function interactions
      msg.channel.send(
        "*YAAAWN*... Is it that time of the week again already?"
      );
      msg.channel.send("Here's your poll for this week...");
      pollArr.forEach(function (item) {
        msg.channel.send(item);
      });

      // poll end
      client.on("messageReactionAdd", async (reaction) => {
        await reaction.fetch();
        if (reaction.count > 9 && reaction.emoji.name === "bd") {
          //"bd" for server / "🤙" for test
          let newName = reaction.message.content;
          msg.channel.send(newName + " is your NEW WEEK NAME!"); ////////////////// Automate Server Name Change
          await msg.guild.setName(newName); // will fail if manage server permission isnt avail

          oldPoll = pollArr;
          pollArr = [];
        }
      });
    } else {
      msg.channel.send("This service only works on Sundays, Sorry");
    }
  }

  //
});

// message react logger - Needs Work

client.on("messageReactionAdd", async (rct, user) => {
  if (rct.message.channel.name === "week-name") {
    await rct.fetch();
    if (rct.count >= 5) {
      if (pollArr.length === 0) {
        pollArr.push(rct.message.content);
        return;
      }

      pollArr.forEach(function (item) {
        if (item === rct.message.content) {
          return;
        }
      });

      pollArr.push(rct.message.content);
      console.log(pollArr);
    }
  } else {
    console.log("trigger return");
    return;
  }
});

// access token
let token = process.env.token;
client.login(token);

///// This Service has ended
/*
// Ping Derek on week suggestions
client.on("messageCreate", msg => {
  const msgArray = msg.content.split(" ");
  

  if (msg.channel.name === "week-name"){
    if (msgArray[msgArray.length - 1].toLowerCase() === "week"){
      msg.channel.send(`mmm YES! ${msg.content} sounds like a wonderful week name doesnt it <@108420414635540480>!`)
     }
  } else{
    return
  }
 
});
*/
