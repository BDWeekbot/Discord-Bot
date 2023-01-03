const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    _id: String, //.id
    channelID: String, // .channelId
    votes: Number, // rct.count
    content: String, // .content
    sender: String, // .author.username
  }, {collection: 'messages'});
  
  
  
  const archiveSchema = new mongoose.Schema({
    _id: String, //.id
    channelID: String, // .channelId
    votes: Number, // rct.count
    content: String, // .content
    sender: String, // .author.username
  }, {collection: 'archive'});

  const userSchema = new mongoose.Schema({
    _id: String, //.id
    user: String,
    name: String, //
    birthday: {
      month: String,
      day: String,
      year: String,
    }, // 

  }, {collection: "users"})

   const eventSchema = new mongoose.Schema({
      _id: String,
      name: String, 
      Date: String, // or date 

   }, {collection: "events"})


  const Message = mongoose.model("Message", messageSchema)
  const Archive = mongoose.model("Archive", archiveSchema)
  const User = mongoose.model("User", userSchema)
  const Event = mongoose.model("Event", eventSchema)

  module.exports = {Message, Archive, User, Event}