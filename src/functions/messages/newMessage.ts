import { Message as Msg, Archive, IMessage} from "../../utils/models.js";
import { Message, PartialMessage } from "discord.js";

async function createNewMessage(message: Message | PartialMessage) {
  // update store with poll array

  try {
    await Msg.create({
      _id: message.id, //.id
      channelID: message.channelId, // .channelId
      votes: 0,
      content: message.content, // .content
      sender: message.author?.id, // .username
    });
    console.log("message created")
    message.channel.send(
      `${message.content}, huh? Good Choice! After your post reaches 3 upvotes, I'll add it to next weeks poll! `
    );
    
  } catch (err) {
    console.log(err);
  }
}

export async function filterRepeatContent(message: Message | PartialMessage) {

    const msg = await Msg.find({ content: message.content })
   
    if (msg.length > 0) {
      console.log("message messages.length ", msg.length);
      console.log("trigger return - duplicate message");
      message.channel.send(
        "Sorry, this suggestion has already been submitted this week"
      );
      return;
    } else {
      const archive = await Archive.find({ content: message })
        if (archive.length > 0) {
          console.log("archive messages.length ", archive.length);
          console.log("trigger return - duplicate message");
          message.channel.send(
            "Sorry, this suggestion was submitted last week"
          );
          return;
        } else {
          createNewMessage(message);
        }
    
    }
  
}

