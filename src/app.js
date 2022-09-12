////////////////// This is your development branch ///////////////////
const botID = "<@1017092115987169390>";

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




/// Functions
function filterRepeatContent(arrChecks, thisArr, message){
  arrChecks.forEach(function(item){
    if(thisArr.includes(item)){
      thisArr.splice(thisArr.indexOf(item), 1)
      message.channel.send(
        item +
          " has been removed from the poll because it was used last week"
      );
    
    }})
  };
  //

function runPoll(archive, newPoll, message){
  message.channel.send("Well anyway....Here's your poll for this week...");
  newPoll.forEach(function (item) {
    message.channel.send(item);
  });

  client.on("messageReactionAdd", async (reaction) => {
    await reaction.fetch();
    if (reaction.count > 9 && reaction.emoji.name === "bd") {
      //"bd" for server / "🤙" for test
      let newName = reaction.message.content;
      message.channel.send(newName + " is your NEW WEEK NAME!");
      await msg.guild.setName(newName); // will fail if manage server permission isnt avail

      archive = newPoll;
      newPoll = [];
    }
  });
};

//
function pingDerek(message){
  let randomNumber = Math.floor(Math.random() * 20)

  if(randomNumber % 5 === 0){
    message.channel.send(`Wowzers! ${message.content} sounds like a wonderful week name doesnt it <@108420414635540480>!`)
    };
};
  


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
    // poll functions
    
    // new week is the poll 
  if (command === "new-week") {
    let date = new Date();

    // getDay() for 0-6, getDate() 0-31
    if (date.getDay() === 0 || 1) {
      //sunday = 0) 
      filterRepeatContent(oldPoll, pollArr, msg)
    

      // function interactions
      if (date.getDay() === 1) {
        msg.channel.send("*YAAAWN*... What? Monday? How long is a week again?");
      } else {
        msg.channel.send(
          "*YAAAWN*... Is it that time of the week again already?"
        );
      }; // install day switch?

      // run poll
      runPoll(oldPoll, pollArr, msg);

    } else {
      msg.channel.send("This service only works on Sundays, Sorry");
    };
  };

  //
 
  // start week begins logging poll criteria
  if (command === "start-week") {
    msg.channel.send("Hello, I am now accepting suggestions for next weeks name");
    msg.channel.send("Your suggestion must end in 'week' and must recieve at least 5 reacts to be entered into Sunday's Poll");
    msg.channel.send("Good Luck!");
    
    client.on("messageCreate", message => {
      const msgArray = message.content.split(" ");
    
  
      if (message.channel.name === "week-name"){
          if (msgArray[msgArray.length - 1].toLowerCase() === "week"){
            message.channel.send(`${message.content}, huh? Good Choice! After 5 this post reaches 5 upvotes, I'll add it to next weeks poll!`);
            pingDerek(msg);
          }
        } else{
          return
        }
    });
  
    
    client.on("messageReactionAdd", async (rct, user) => {
  

      if (rct.message.channel.name === "week-name") {
        await rct.fetch();
    
        console.log(rct.message, user);
        
        if (rct.count >= 5) {
          if (pollArr.length === 0) {
            pollArr.push(rct.message.content);
            rct.message.channel.send(`${rct.message.content} has been added to the poll`)
            return;
          }
    
          pollArr.forEach(function (item) {
            if (item === rct.message.content) {
              return;
            }
          });
    
          pollArr.push(rct.message.content);
          rct.message.channel.send(`${rct.message.content} has been added to the poll`)
          rct.message.channel.send(`The current candidates are: `)
          pollArr.forEach(item =>{
            rct.message.channel.send(item);
          });
        }
    
      } else {
        console.log("trigger return");
        return;
      }
    }); // message react logger - Needs Work

    
  }
  
  //
});








// access token
let token = process.env.token;
client.login(token);


/*




*/