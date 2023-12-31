import {
  Guild,
  Client,
  TextChannel,
  ComponentType,
  StringSelectMenuInteraction,
} from "discord.js";
import { Archive, Message } from "../../utils/models.js";
import { submission } from "./changeServerName.js";

interface Ballot {
  userID: string;
  username: string;
  primarySelection: string;
  secondarySelection: string,
  tertiarySelection: string,
}

function tally(ballots: Map<string, Ballot>) {
  const tallies: Record<string, number> = {};
  let highCount = 0;
  let newName = "";

  for (const ballot of ballots.values()) {
    const firstChoice = ballot.primarySelection;
    const secondChoid = ballot.secondarySelection;
    const thirdChoice = ballot.tertiarySelection;

    tallies[firstChoice] = (tallies[firstChoice] || 0) + 3;
    tallies[secondChoid] = (tallies[secondChoid] || 0) + 2;
    tallies[thirdChoice] = (tallies[thirdChoice] || 0) + 1;
  }

  for (const [name, count] of Object.entries(tallies)) {
    if (count > highCount) {
      highCount = count;
      newName = name;
    }
  }

  return newName;
}

export async function activatePollListener(
  client: Client,
  guildId: String,
  channelId: String,
  submissionArray: Array<submission>
) {
  console.log("Poll Listener: Active");
  const guild = client.guilds.cache.get(`${guildId}`) as Guild;
  const channel = client.channels.cache.get(
    `${channelId}`
  ) as TextChannel;

  let ballots = new Map<string, Ballot>();

  const pollSelectionCollector = channel.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    time: 864000,
  });

  pollSelectionCollector.on("collect", (selectInteraction: StringSelectMenuInteraction) => {
    selectInteraction.deferUpdate();
    
    console.log("select interaction:" + selectInteraction.user.id)
  
    let userBallot = ballots.get(selectInteraction.user.id);
    if (userBallot === undefined) {
      let ballot: Ballot = {
        userID: selectInteraction.user.id,
        username: selectInteraction.user.displayName,
        primarySelection: selectInteraction.values[0],
        secondarySelection: selectInteraction.values[1],
        tertiarySelection: selectInteraction.values[2],
      };
      ballots.set(selectInteraction.user.id, ballot);
    }
  });

  pollSelectionCollector.on("end", async (interaction) => {
    console.log("Poll Listener: Ended");
    if (ballots.size === 0) {
      console.log("No Votes");
      return;
    }

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


