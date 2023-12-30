import { Message, PartialMessage, MessageReaction, User, Client, Events, PartialMessageReaction, PartialUser, GuildTextBasedChannel} from "discord.js";
//import  {filterRepeatContent}  from "../functions/messages/newMessage.js";
import { Message as messageObj } from "../utils/models.js";

export function WeekListener(client: Client) {
  client.on("messageCreate", async (message: Message | PartialMessage) => {
    const channel : GuildTextBasedChannel = client.channels.cache.get(`${message.channelId}`) as GuildTextBasedChannel;
   
    if (!message.author || message.author.bot) {
      return;
    }
    const msgArrayType : string | null = message.content
    const msgArray: string[] = msgArrayType!.split(" ");

    console.log(msgArray)
    if (
      channel.name === "week-name" &&
      (msgArray[msgArray.length - 1].toLowerCase() === "week" ||
        msgArray[msgArray.length - 1].toLowerCase() === "week.")
    ) {
      //filterRepeatContent(message);
      console.log("message.content ", message.content);
    } else {
      
      console.log("return trigger - message creation");
    }
  });

  client.on("messageReactionAdd", async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.log(error);
        return;
      }
    }
    if (reaction.message.channel.id === "week-name"
     && reaction.emoji.name === "bd"
     && !reaction.message.author?.bot) {
       //👍
        const message = await messageObj.findOne({
          _id: reaction.message.id,
        });
        if (message) {
          message.votes += 1;
          await message.save();
          console.log("message.votes ", message.votes);
          
          if (message.votes === 3) {
            const msg = await messageObj.findOne({
              _id: message._id,
            });
            if (msg) {
              msg.votes = message.votes;
              await msg.save();
              console.log("msg.votes ", msg.votes);
              reaction.message.channel.send(
                `Congratulations ${message.content} has been added to the poll!`
              );
            }
          }
        }
      }
    }
  )
}


