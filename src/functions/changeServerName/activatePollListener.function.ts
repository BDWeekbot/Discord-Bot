import {
  Channel,
  Guild,
  Client,
  Collector,
  Events,
  Interaction,
  TextChannel,
  ComponentType,
  StringSelectMenuInteraction,
  ButtonInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
} from "discord.js";
import { Archive, Message, IsPollActive } from "../../utils/models.js";
import { submission } from "./changeServerName.js";

interface Ballot {
  userID: string;
  username: string;
  primarySelection: string;
  // secondarySelection: string,
  // tertiarySelection: string,
}

function tally(array: Array<Ballot>) {
  const tallies: Record<string, number> = {};
  let highCount = 0;
  let newName = "";

  for (const { primarySelection } of array) {
    tallies[primarySelection] = (tallies[primarySelection] || 0) + 1;
  }

  for (const [selection, count] of Object.entries(tallies)) {
    if (count > highCount) {
      highCount = count;
      newName = selection;
    }
  }
  return newName;
}

export async function activatePollListener(
  commandInteraction: ChatInputCommandInteraction,
  client: Client,
  guildId: String,
  channelId: String,
  submissionArray: Array<submission>
) {
  console.log("Poll Listener: Active");
  const guild = (await client.guilds.cache.get(`${guildId}`)) as Guild;
  const channel = (await client.channels.cache.get(
    `${channelId}`
  )) as TextChannel;

  let ballots = new Array<Ballot>();

  

  const collector = channel.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    time: 30000,
  });

  collector.on("collect", (selectInteraction: StringSelectMenuInteraction) => {
    selectInteraction.deferUpdate();
    
    console.log("select interaction:" + selectInteraction.user.id)
    let ballot: Ballot;

    let ballotFilter = ballots.filter(
      (ballot) => ballot.userID === selectInteraction.user.id
    );


    if (
      ballots.filter((ballot) => ballot.userID === selectInteraction.user.id)
        .length > 0
    ) {
      ballot = ballotFilter[0];
      console.log("if : " + ballot.username + ballot.primarySelection);
      console.log("ballotFilter " + ballot.username + ballotFilter[0].primarySelection);
      ballot.primarySelection = selectInteraction.values[0];
      let ballotIndex = ballots.indexOf(ballot);
      ballots[ballotIndex] = ballot;
    } else {
      ballot = {
        userID: selectInteraction.user.id,
        username: selectInteraction.user.displayName,
        primarySelection: selectInteraction.values[0],
        // secondarySelection: "string",
        // tertiarySelection: "string"
      };
      
      console.log("else : " + ballot.primarySelection);
      ballots.push(ballot);
    }
  });

  collector.on("end", async (interaction) => {
    console.log("Poll Listener: Ended");
    if (ballots.length === 0) {
      console.log("No Votes");
      return;
    }

    ballots.forEach((ballot) => console.log(ballot.username + ballot.primarySelection))
    let electedName = tally(ballots)
    let submissionSelection = submissionArray.filter(
      (submission) => submission.value === electedName
    );

    console.log("New Server Name on End: " + submissionSelection[0].label);
    await guild.setName(submissionSelection[0].label);

    await Message.find()
      .where("votes")
      .gte(1)
      .then(function (messages) {
         try{
          messages.forEach((message) => {
            Archive.create({
            _id: message.id, //.id
            votes: message.votes,
            content: message.content, // .content
            sender: message.id, // .username
          }).then(function (){
            Message.deleteMany().where("votes").gte(0)
           })
        });
         }
          catch(err){
            console.log(err)
          }
       
      })
    
  });
}


