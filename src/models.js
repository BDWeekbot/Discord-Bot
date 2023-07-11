const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    _id: String, //.id
    channelID: String, // .channelId
    votes: Number, // rct.count
    content: String, // .content
    sender: String, // .author.username
  },
  { collection: "messages" },
);

const archiveSchema = new mongoose.Schema(
  {
    _id: String, //.id
    channelID: String, // .channelId
    votes: Number, // rct.count
    content: String, // .content
    sender: String, // .author.username
  },
  { collection: "archive" },
);

const userSchema = new mongoose.Schema(
  {
    _id: String, //.id
    user: String,
    name: String, //
    birthday: {
      month: String,
      day: String,
      year: String,
    }, //
  },
  { collection: "users" },
);

const eventSchema = new mongoose.Schema(
  {
    _id: String,
    rsvp: Array,
    guildId: String,
    channelId: String,
    name: String,
    date: {
      month: String,
      day: String,
      year: String,
    },
    time: String,
    description: String,
    botText: String, // or date

    // rsvp members by react ---- update array of user id's - edit embed with a list of rsvp'd members ?
  },
  { collection: "events" },
);

const Message = mongoose.model("Message", messageSchema);
const Archive = mongoose.model("Archive", archiveSchema);
const User = mongoose.model("User", userSchema);
const Event = mongoose.model("Event", eventSchema);

module.exports = { Message, Archive, User, Event };
