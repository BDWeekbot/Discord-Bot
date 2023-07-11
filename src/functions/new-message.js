const { Archive, Message } = require("../models");

async function createNewMessage(message) {
  // update store with poll array

  try {
    await Message.create({
      _id: message.id, //.id
      channelID: message.channelId, // .channelId
      votes: 0,
      content: message.content, // .content
      sender: message.author.id, // .username
    });

    message.channel.send(
      `${message.content}, huh? Good Choice! After your post reaches 3 upvotes, I'll add it to next weeks poll! `,
    );
  } catch (err) {
    console.log(err);
  }
}

function filterRepeatContent(message) {
  Message.find({ content: message }, function (err, messages) {
    if (err) {
      console.log(err);
    } else if (messages.length > 0) {
      console.log("message messages.length ", messages.length);
      console.log("trigger return - duplicate message");
      message.channel.send(
        "Sorry, this suggestion has already been submitted this week",
      );
      return;
    } else {
      Archive.find({ content: message }, function (err, messages) {
        if (err) {
          console.log(err);
        } else if (messages.length > 0) {
          console.log("archive messages.length ", messages.length);
          console.log("trigger return - duplicate message");
          message.channel.send(
            "Sorry, this suggestion was submitted last week",
          );
          return;
        } else {
          createNewMessage(message);
        }
      });
    }
  });
}

module.exports = { filterRepeatContent };
