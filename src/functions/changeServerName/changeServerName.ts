import { IMessage } from "../../utils/models.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Client,
  StringSelectMenuBuilder,
  TextChannel,
  ComponentType,
  ButtonInteraction,
} from "discord.js";
import { activatePollListener } from "./activatePollListener.function.js";

export interface submission {
  label: string;
  value: string;
}

// not let poll be called if active
// 100 character limit in week names

export async function changeServerName(
  commandInteraction: ChatInputCommandInteraction,
  client: Client,
  pollOptions: Array<IMessage>
) {
  const guildId = commandInteraction.guildId as string;
  const channelId = commandInteraction.channelId as string;
  const channel = client.channels.cache.get(`${channelId}`) as TextChannel;
  const weekNames = Array.from(
    pollOptions,
    (message) => { return { label: message.content, value: message.id } }
  );
  const ballotBox = new Array<ActionRowBuilder<StringSelectMenuBuilder> | ActionRowBuilder<ButtonBuilder>>;

  const primarySelect: StringSelectMenuBuilder = new StringSelectMenuBuilder()
    .setCustomId("primarySelection")
    .setPlaceholder("1st Choice")
    .addOptions(weekNames);

  const secondarySelect: StringSelectMenuBuilder = new StringSelectMenuBuilder()
    .setCustomId("secondarySelection")
    .setPlaceholder("2nd Choice")
    .addOptions(weekNames)

  const tertiarySelect: StringSelectMenuBuilder = new StringSelectMenuBuilder()
    .setCustomId("tertiarySelection")
    .setPlaceholder("3rd Choice")
    .addOptions(weekNames)

  const submitButton: ButtonBuilder = new ButtonBuilder()
    .setCustomId("submit")
    .setLabel("Submit")
    .setStyle(ButtonStyle.Success);

  const primaryActionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(primarySelect);
  const secondaryActionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(secondarySelect)
  const tertiaryActionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(tertiarySelect)
  const submitButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(submitButton);

  ballotBox.push(primaryActionRow, secondaryActionRow, tertiaryActionRow, submitButtonRow)

  const buttonCollector = channel.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 86400,
  });

  await activatePollListener(
    client,
    guildId,
    channelId,
    weekNames
  );

  buttonCollector.on(
    "collect",
    async (buttonInteraction: ButtonInteraction) => {
      buttonInteraction.reply({ ephemeral: true, content: "Thank you for your submission." })
    }
  );

  buttonCollector.on("end", async (buttonInteraction: ButtonInteraction) => {
    console.log("button collector end");

    ballotBox.forEach((row) => {
      row.components[0].setDisabled(true);
    });

    commandInteraction.editReply({
      content: " Thank you for your submission. The poll has ended.",
      components: ballotBox,
    });
  });

  commandInteraction.reply({
    content:
      " Please make a selection for the Week Name Poll",
    components: ballotBox
  });
}