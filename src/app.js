////////////////// This is your development branch ///////////////////
const botID = "<@1017092115987169390>";


// change time from UTC to PST
// Tell User Their Submission is a Duplicate



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
  DefaultRestOptions,
} = require("discord.js");
const mongoose = require("mongoose");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});


const { Archive, Message } = require("./models.js");
const {filterRepeatContent} = require("./functions/new-message")

const {parseWeekbotCommand} = require("./functions/commandParsing")
const {eventModule} = require("./events/events")

// load .env for keys
require("dotenv").config();
// if run from src folder require("dotenv").config({path:"../.env"})

// connection confirmation
client.on("ready", function () {
  console.log("Connected as " + client.user.tag);
  client.user.setActivity("DEREK", { type: "WATCHING" }); 
  //eventModule() // instantiate events on application load
});

// command response
client.on("messageCreate", (msg) => {
  parseWeekbotCommand(msg);  
  
});

// Message Stream Check 

client.on("messageCreate", (message) => {
  const msgArray = message.content.split(" ");
  if (message.channel.name === "week-name" && !message.author.bot) {
    if (msgArray[msgArray.length - 1].toLowerCase() === "week") {

          filterRepeatContent(message);
         
        }
    } 
   else {
    console.log("return trigger - message creation");
    return;
  }

});

// message reaction stream check

client.on("messageReactionAdd", async (reaction, user) => {
  await reaction.fetch();
  if (reaction.message.channel.name === "week-name" && !reaction.message.author.bot) {
         
        
  var user_id = reaction.message.id;
  Message.findByIdAndUpdate(user_id, { votes: reaction.count },
                              function (err, docs) {
      if (err){
          console.log(err)
      }
      else{
          console.log("Updated Message : ", docs);
      }
    });
      


  if (reaction.count === 3) { /////////////////// Change to 3
    reaction.message.channel.send(
      `${reaction.message.content} has been added to the poll`
    );
    reaction.message.channel.send(`The current candidates are: `);
    
    Message.find({ votes: {$gte: 3}}, function (err, messages) { /////////////////// Change to 3
      if (err){
        console.log(err);
      }
      else{
      
      messages.forEach(message =>{
        reaction.message.channel.send(message.content)
      })};
    });
    
    }

      
    
  } else {
    console.log("trigger return - message reaction");
    return;
  }
}); 


// access token
let token = process.env.TOKEN;
client.login(token);

// mongoose connect 
let mongooseconnectionstring = process.env.DB_Url;

if (!mongooseconnectionstring) return;
  mongoose.connect(mongooseconnectionstring, {dbName: 'discordServer'}).then(() => console.log("Connected to MongoDB"));

