////////////////// This is your development branch ///////////////////
const botID = "<@1017092115987169390>";
// to-do list:
// Fix bot author negation on pingderek
// lower reaction count for victory - DONE

// poll array
let oldPoll = [];
let pollArr = [];

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

// mongoose declarations

const messageSchema = new mongoose.Schema({
  // need _id 
  channelID: String, // .channelId
  id: String, //.id
  content: String, // .content
  votes: Number, //.reactions || think it needs to be an array
  sender: String, // .username

}, {collection: 'messages'});

const Message = mongoose.model("Message", messageSchema)



/// Functions
function filterRepeatContent(arrChecks, thisArr, message) {
  arrChecks.forEach(function (item) {
    if (thisArr.includes(item)) {
      thisArr.splice(thisArr.indexOf(item), 1);
      message.channel.send(
        item + " has been removed from the poll because it was used last week"
      );
    }
  });
}
//

function runPoll(archive, newPoll, message) {
  message.channel.send("Well anyway....Here's your poll for this week...");
  newPoll.forEach(function (item) {
    message.channel.send(item);
  });

  client.on("messageReactionAdd", async (reaction) => {
    await reaction.fetch();
    if (reaction.count > 6 && reaction.emoji.name === "🤙") {
      //"bd" for server / "🤙" for test
      let newName = reaction.message.content;
      message.channel.send(newName + " is your NEW WEEK NAME!");
      await message.guild.setName(newName); // will fail if manage server permission isnt avail

      archive = newPoll;
      newPoll = [];
      
      setTimeout(() => {
        message.channel.send(
          "Hello, I am now accepting suggestions for next weeks name"
        );
        message.channel.send(
          "Your suggestion must end in 'week' and must recieve at least 5 reacts to be entered into Sunday's Poll"
        );
        message.channel.send("Good Luck! ");

      }, "5000")
     
      
    }
  });
}

//
function pingDerek(message) {
  let randomNumber = Math.floor(Math.random() * 20);

  if (randomNumber % 5 === 0) {
    message.channel.send(
      `Wowzers! ${message.content} sounds like a wonderful week name doesnt it <@108420414635540480>!` // message.content is always >start-week

    );
  }
}

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


 
  



//
////


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

  if (command === "weekbot"){
    msg.channel.send("*Week Bot has acknowledged your attempt to attract its attention*");
    msg.channel.send("*Week Bot has chosen not to dignify your attempt with a response*");
    
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

  //

  // run poll for new week command
  // poll functions

  // new week is the poll
  if (command === "new-week") {
    let date = new Date();

    // getDay() for 0-6, getDate() 0-31
    if (date.getDay() === 0 || date.getDay() === 1) {
      //sunday = 0)
      filterRepeatContent(oldPoll, pollArr, msg);

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
      runPoll(oldPoll, pollArr, msg);
    } else {
      console.log("return trigger - wrong day - not sunday or monday")
      msg.channel.send("This service only works on Sundays, Sorry");
      return
    }
  }

  //

  
  
});

client.on("messageCreate", (message) => {
  const msgArray = message.content.split(" ");

  if (message.channel.name === "week-name" && !message.author.bot) {

    
    if (msgArray[msgArray.length - 1].toLowerCase() === "week") {
      message.channel.send(
        `${message.content}, huh? Good Choice! After this post reaches 4 upvotes, I'll add it to next weeks poll! `)
        
   
   

      async function run() {
        try{
          await Message.create({
            channelID: message.channelId, // .channelId
            id: message.id, //.id
            content: message.content, // .content
            //votes: message.reactions, //.reactions
            sender: message.username, // .username
          });
  
          Message.find(function(err, messages){
            if(err) {
              console.log(err)
            } else {
              messages.forEach(item =>{
                console.log(item.content)
              })
              
            }
          }) 
        }catch(err){
          console.log(err)
        }
        }
  
      run();
      pingDerek(message);
    }
  } else {
    console.log("return trigger - message creation");
    return;
  }

});

client.on("messageReactionAdd", async (rct, user) => {
  await rct.fetch();
  if (rct.message.channel.name === "week-name" && !rct.message.author.bot) {
    

    if (rct.count >= 4) {
      if (pollArr.length === 0) {
        pollArr.push(rct.message.content);
        rct.message.channel.send(
          `${rct.message.content} has been added to the poll`
        );
        console.log("successfully added to poll")
        return;
      }
  
      if (pollArr.includes(rct.message.content)){
        console.log("return from duplicate message")
        return
      } else {
      pollArr.push(rct.message.content); 
      
      rct.message.channel.send(
        `${rct.message.content} has been added to the poll`
      );
      rct.message.channel.send(`The current candidates are: `);
      pollArr.forEach((item) => {
        rct.message.channel.send(item);
      });
      }

      
    }
  } else {
    console.log("trigger return - message reaction");
    return;
  }
}); // message react logger - Needs Work


// access token
let token = process.env.token;
client.login(token);

// mongoose connect 
let mongooseconnectionstring = process.env.mongooseconnectionstring;

if (!mongooseconnectionstring) return;
  mongoose.connect(mongooseconnectionstring, {dbName: 'discordServer'}).then(() => console.log("Connected to MongoDB"));
/*




*/
