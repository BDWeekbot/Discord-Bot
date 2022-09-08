// load discord.js
const {Client, Collection, GatewayIntentBits, messageLink, CommandInteractionOptionResolver} = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]}
  );

// load .env for keys
require("dotenv").config({path:"../.env"});


// connection confirmation
client.on("ready", function() {
    console.log("Connected as " + client.user.tag)
    client.user.setActivity("DEREK", {type: "WATCHING"})
});

// prefix for commands
const prefix = ">";

// command response 
client.on("messageCreate", msg => {
  // reads prefix commands and no response to own message
   if(!msg.content.startsWith(prefix) || msg.author.bot) return;

   //cuts prefix out of parsing
   const args = msg.content.slice(prefix.length).split(/ +/);
   const command = args.shift().toLowerCase();

  /// Message Array
   const msgArray = msg.content.split(" ");
   const argument = msgArray.slice(1);
   const cmd = msgArray[0];

   /////// Commands

   // test command

   if (command === "ping"){
    msg.channel.send("pong");
   };

  });

// Ping Derek on week suggestions
client.on("messageCreate", msg => {
  if (!msg.channel.name === "week-name") return;
  if (msgArray[msgArray.length - 1].toLowerCase() === "week"){
   msg.channel.send(`mmm YES! ${msg.content} sounds like a wonderful week name doesnt it <@108420414635540480>!`)
  }
});

// access token
let token = process.env.token;
client.login(token);

