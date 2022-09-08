// load discord.js
const {Client, Collection, GatewayIntentBits, messageLink, CommandInteractionOptionResolver, MessageReaction, Partials} = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent],
                            partials: [Partials.Message, Partials.Channel, Partials.Reaction],}
  );

// load .env for keys
require("dotenv").config();
// if run from src folder require("dotenv").config({path:"../.env"})


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
   console.log(msgArray)
   // 
   if (command === "help" || command === "list"){
    msg.channel.send("No Help Yet");
   };

   if (command === "date"){
    let date = new Date()
    msg.channel.send("today is " + date);
   };

  });

// Ping Derek on week suggestions
client.on("messageCreate", msg => {
  const msgArray = msg.content.split(" ");

  if (!msg.channel.name === "week-name") return;
  if (msgArray[msgArray.length - 1].toLowerCase() === "week"){
   msg.channel.send(`mmm YES! ${msg.content} sounds like a wonderful week name doesnt it <@108420414635540480>!`)
  }
});

let pollArr = [];
// message react logger

client.on("messageReactionAdd", async (rct, user) => {
  console.log("Reaction Logged")
  if(!rct.message.channel === "week-name") return;

  await rct.fetch();
	console.log(`${rct.message.author}'s message "${rct.message.content}" gained a rct!`);
	console.log(`${rct.count} user(s) have given the same reaction to this message!`);

  if (rct.count >= 5){
    if(pollArr.length === 0){
      pollArr.push(rct.message.content)
      console.log(pollArr)
      return
    };

    pollArr.forEach(function(item){
      if (item === rct.message.content){
         return;
    } else{
      pollArr.push(rct.message.content)
      console.log(pollArr)
    }})
    
  }

});

/*
let date = new Date()

if (date.getDate() === 0 //sunday = 0){

};
*/

// add msg.content with 5+ reacts to array
// get day -  => if sunday add array to poll => search array for poll result => change server name

// access token
let token = process.env.token;
client.login(token);

