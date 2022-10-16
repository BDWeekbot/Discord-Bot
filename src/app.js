////////////////// This is your development branch ///////////////////
const botID = "<@1017092115987169390>";


// change time from UTC to PST

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

// load .env for keys
require("dotenv").config();
// if run from src folder require("dotenv").config({path:"../.env"})

// connection confirmation
client.on("ready", function () {
  console.log("Connected as " + client.user.tag);
  client.user.setActivity("DEREK", { type: "WATCHING" }); // This Doesnt work
});

// prefix for commands
const prefix = ">";

// mongoose declarations

const messageSchema = new mongoose.Schema({
  _id: String, //.id
  channelID: String, // .channelId
  votes: Number, // rct.count
  content: String, // .content
  sender: String, // .author.username
}, {collection: 'messages'});

const Message = mongoose.model("Message", messageSchema)

const archiveSchema = new mongoose.Schema({
  _id: String, //.id
  channelID: String, // .channelId
  votes: Number, // rct.count
  content: String, // .content
  sender: String, // .author.username
}, {collection: 'archive'});

const Archive = mongoose.model("Archive", archiveSchema)




/// Functions
function filterRepeatContent(message) {

 Message.find({content: message}, function(err, messages){
            
                if (messages.length != 0){
                  console.log("return trigger - duplicate message")
                  return false;
                } else {
                  Archive.find({content: message}, function(err, messages){
            
                    if (messages.length != 0){
                      console.log("return trigger - duplicate message")
                      return false;
                    } else {
                      return true;
                    }
                  
                })
                }
              
            })

  
  

 
}

//

function runPoll(message) {
  message.channel.send("Well anyway....Here's your poll for this week... The first selection listed below to reach 4 votes will be the new week name");

  async function run() {
    try{
     
      Message.find({votes: {$gte: 3}},function(err, messages){  /////////////////// Change to 3
        if(err) {
          console.log(err)
        } else {
          messages.forEach(item =>{
            message.channel.send(item.content)
            
            Archive.create({
                _id: item.id, //.id
                channelID: item.channelId, // .channelId
                votes: item.votes,
                content: item.content, // .content
                sender: item.id, // .username
              })
             
          })
          
        }
      }) 

      
    }catch(err){
      console.log(err)
    }
    }
  run();


  client.on("messageReactionAdd", async (reaction) => {
    await reaction.fetch();
    if (reaction.count >= 4 && reaction.emoji.name === "bd" && reaction.message.author.bot) { /////////////////// Change to 4
      //"bd" for server / "🤙" for test
      let newName = reaction.message.content;
     
      try{
        message.channel.send(newName + " is your NEW WEEK NAME!");
        await message.guild.setName(newName); // will fail if manage server permission isnt avail


      }
      catch(err){
        console.log(err)
      }
      
      setTimeout(() => {
        message.channel.send(
          "Hello, I am now accepting suggestions for next weeks name"
        );
        message.channel.send(
          "Your suggestion must end in 'week' and must recieve at least 5 reacts to be entered into Sunday's Poll"
        );
        message.channel.send("Good Luck! ");

      }, "5000")

      async function deleteAll() {
        try{
         
          Message.deleteMany({votes: {$gte: 0}}, function(err, messages){
            if(err){
              console.log(err)
            } else {
              console.log(messages)
            }
          })
    
          
        }catch(err){
          console.log(err)
        }
        }
      deleteAll();
   
      
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

  //

  // run poll for new week command
  // poll functions
  if (command === "pun-roll"){
    runPoll(msg);
  }

  // new week is the poll
  if (command === "new-week") {
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

  //

  
  
});

client.on("messageCreate", (message) => {
  const msgArray = message.content.split(" ");
  if (message.channel.name === "week-name" && !message.author.bot) {

    if (msgArray[msgArray.length - 1].toLowerCase() === "week" && filterRepeatContent(message.content)) {
      message.channel.send(
        `${message.content}, huh? Good Choice! After this post reaches 4 upvotes, I'll add it to next weeks poll! `)
        
     
   

      async function run() {
        try{
          await Message.create({
            _id: message.id, //.id
            channelID: message.channelId, // .channelId
            votes: 0,
            content: message.content, // .content
            sender: message.author.id, // .username
          });
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
         
        
        var user_id = rct.message.id;
        Message.findByIdAndUpdate(user_id, { votes: rct.count },
                                    function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                console.log("Updated Message : ", docs);
            }
         });
      


  if (rct.count >= 3) { /////////////////// Change to 3
    rct.message.channel.send(
      `${rct.message.content} has been added to the poll`
    );
    rct.message.channel.send(`The current candidates are: `);
    
    Message.find
    Message.find({ votes: {$gte: 3}}, function (err, messages) { /////////////////// Change to 3
      if (err){
        console.log(err);
      }
      else{
      messages.forEach(message =>{
        rct.message.channel.send(message.content)
      })
      }
    });
    
    }

      
    
  } else {
    console.log("trigger return - message reaction");
    return;
  }
}); 


// access token
let token = process.env.token;
client.login(token);

// mongoose connect 
let mongooseconnectionstring = process.env.DB_Url;

if (!mongooseconnectionstring) return;
  mongoose.connect(mongooseconnectionstring, {dbName: 'discordServer'}).then(() => console.log("Connected to MongoDB"));

