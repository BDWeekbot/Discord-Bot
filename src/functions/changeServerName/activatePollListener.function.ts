import {
  Guild,
  Client,
  TextChannel,
  ComponentType,
  StringSelectMenuInteraction,
} from "discord.js";
import { Archive, Message } from "../../utils/models";
import { submission } from "./changeServerName";

export interface Ballot {
  userID: string;
  username: string;
  primarySelection: string;
  secondarySelection: string,
  tertiarySelection: string,
}

export function tally(ballots: Map<string, Ballot>) {
  let tally = new Map<string, number>();
  ballots.forEach((ballot) => {
    tally.set(ballot.primarySelection, (tally.get(ballot.primarySelection) || 0) + 3);
    tally.set(ballot.secondarySelection, (tally.get(ballot.secondarySelection) || 0) + 2);
    tally.set(ballot.tertiarySelection, (tally.get(ballot.tertiarySelection) || 0) + 1);
  });

  let maxVotes = 0;
  let maxVoteOption = "";
  tally.forEach((votes, option) => {
    if (votes > maxVotes) {
      maxVotes = votes;
      maxVoteOption = option;
    }
  });
  return maxVoteOption;
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
    time: 86400,
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
    } else {
      userBallot.primarySelection = selectInteraction.values[0];
      userBallot.secondarySelection = selectInteraction.values[1];
      userBallot.tertiarySelection = selectInteraction.values[2];
    }
  });

  pollSelectionCollector.on("end", async () => {
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
        try {
          messages.forEach((message) => {
            Archive.create({
              _id: message.id, //.id
              votes: message.votes,
              content: message.content, // .content
              sender: message.id, // .username
            }).then(function () {
              Message.deleteMany().where("votes").gte(0)
            })
          });
        }
        catch (err) {
          console.log(err)
        }

      })

  });
}


