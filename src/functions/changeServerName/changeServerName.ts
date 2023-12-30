import { Archive, Message, IsPollActive } from "../../utils/models.js";
import { Types, set } from "mongoose";
import {
  ActionRowBuilder,
  AnySelectMenuInteraction,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Client,
  Events,
  Interaction,
  InteractionCollector,
  MessageCollector,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  StringSelectMenuOptionBuilder,
  TextChannel,
  ComponentType,
  Collector,
  ButtonInteraction,
  Options,
} from "discord.js";
import { activatePollListener } from "./activatePollListener.function.js";
import mongoose from "mongoose";
import message from "../../events/message.js";

export interface submission {
  label: string;
  value: string;
}

export async function changeServerName(
  commandInteraction: ChatInputCommandInteraction,
  client: Client
) {
  const guildId = commandInteraction.guildId as string;
  const channelId = commandInteraction.channelId as string;

  const channel = client.channels.cache.get(`${channelId}`) as TextChannel;
  const guild = client.guilds.cache.get(`${guildId}`);

  try {
    let dropdownArray = new Array();

    await Message.find()
      .where("votes")
      .gte(1)
      .then(function (messages) {
        messages.forEach((message) => {
          dropdownArray.push({
            label: message.content,
            value: message.id,
        });
        });
        
        if (dropdownArray.length === 0) {
          commandInteraction.reply({content: "there are no submissions"})
          return;
        //   dropdownArray.push({
        //     label: "No One Submit a Name, You Fucks, Week",
        //     value: "1234567",
        //   });
        //   dropdownArray.push({
        //     label: "By unanimous decison, Brandon is now God, Week",
        //     value: "7654321",
        //   });

        //   dropdownArray.push({
        //     label: "third option week",
        //     value: "2654222",
        //   });
         } else{
            activatePollListener(
              commandInteraction,
              client,
              guildId,
              channelId,
              dropdownArray
            );
         }
      });

    const primarySelect: StringSelectMenuBuilder = new StringSelectMenuBuilder()
      .setCustomId("primarySelection")
      .setPlaceholder("1st Choice")
      .addOptions(dropdownArray);

    //    const secondarySelect: StringSelectMenuBuilder = new StringSelectMenuBuilder()
    //    .setCustomId("secondarySelection")
    //    .setPlaceholder("2nd Choice")
    //    .addOptions(dropdownArray)

    //    const tertiarySelect: StringSelectMenuBuilder = new StringSelectMenuBuilder()
    //    .setCustomId("tertiarySelection")
    //    .setPlaceholder("3rd Choice")
    //    .addOptions(dropdownArray)

    const submitButton: ButtonBuilder = new ButtonBuilder()
      .setCustomId("submit")
      .setLabel("Submit")
      .setStyle(ButtonStyle.Success);

    const primaryActionRow =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        primarySelect
      );
    // const secondaryActionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(secondarySelect)
    // const tertiaryActionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(tertiarySelect)
    const submitButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      submitButton
    );

    const buttonCollector = channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 30000,
    });

    const messageCollector = channel.createMessageCollector({
      time: 25000,
    })

    messageCollector.on("collect", async (message) => {
      console.log("message collector collect");
      console.log(message.content);
    })

    buttonCollector.on(
      "collect",
      async (buttonInteraction: ButtonInteraction) => {
        buttonInteraction.reply({ephemeral: true, content: "Thank you for your submission"})
        console.log("button interaction defer reply");
        
        console.log("command interaction reply edit");
        // commandInteraction.editReply({
        //   content: " Thank you for your submission",
        //   components: [primaryActionRow, submitButtonRow],
        // });
      }
    );

    
    

    buttonCollector.on("end", async (buttonInteraction: ButtonInteraction) => {
      console.log("button collector end");
      submitButton.setDisabled(true);
      primarySelect.setDisabled(true);
      console.log("command interaction reply edit");
      commandInteraction.editReply({
        content: " Thank you for your submission",
        components: [primaryActionRow, submitButtonRow],
      });
    });


  
  

    



    commandInteraction.reply({
      content:
        " Please make 3 selections for the Week Name Poll (Ranked Choice Voting)",
      components: [primaryActionRow, submitButtonRow],
    }); // secondaryActionRow, tertiaryActionRow,
    console.log("command interaction reply");
  } catch (err) {
    console.log(err);
  }
}

// testing comment -- replace for push
