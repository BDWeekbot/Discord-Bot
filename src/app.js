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

// USE REDUX TO INITIALIZE STATE MANAGEMENT

const { eventModule } = require("./events/events");

const { autocompleteHandler } = require("./handlers/autocomplete.handler");
const { Commandler } = require("./handlers/commandler");
const { menuTree } = require("./handlers/menu.handler");
const { WeekListener } = require("./handlers/weekListener");

// load .env for keys
require("dotenv").config();
// if run from src folder require("dotenv").config({path:"../.env"})

// connection confirmation
client.on("ready", function () {
  console.log("Connected as " + client.user.tag);
  client.user.setActivity("DEREK", { type: "WATCHING" });
  eventModule(client);
  Commandler(client); // message + reaction handler
  menuTree(client);
  WeekListener(client);
  autocompleteHandler(client);

  // instantiate events on application load
  // pollModule() -- not built - instantiate message listeners
});

///// To Do
/*
Create Menu Tree with Buttons to increase UX Design
  -- @weekbot triggers clickable tree @weekbot replaces ">"

Make Birthdays functional

*/

// access token
let token = process.env.token;
client.login(token);

// mongoose connect
let mongooseconnectionstring = process.env.DB_Url;

if (!mongooseconnectionstring) return;
mongoose
  .connect(mongooseconnectionstring, { dbName: "discordServer" })
  .then(() => console.log("Connected to MongoDB"));
