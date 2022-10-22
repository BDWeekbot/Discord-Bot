const mongoose = require("mongoose");

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

  module.exports = {Message, Archive}