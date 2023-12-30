import { BaseSelectMenuBuilder, Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { registerEvents } from "./utils/events.js";
import Events from './events/eventsExport.js'
import Keys from "./keys.js";
import { APIEmbedField, APIEmbedAuthor, APIEmbedFooter, APIEmbedImage, APIEmbed, APISelectMenuOption, APIMessageComponentEmoji, ButtonStyle, ChannelType, APIActionRowComponent, APIActionRowComponentTypes, APIBaseComponent, ComponentType, APIButtonComponent, APISelectMenuComponent, APIChannelSelectComponent, APIMentionableSelectComponent, APIRoleSelectComponent, APIStringSelectComponent, APIUserSelectComponent, APITextInputComponent, TextInputStyle, APIMessageActionRowComponent, APIModalActionRowComponent, APIModalComponent, APIMessageComponent, APIModalInteractionResponseCallbackData, LocalizationMap, LocaleString, ApplicationCommandOptionType, APIApplicationCommandBasicOption, APIApplicationCommandAttachmentOption, APIApplicationCommandBooleanOption, APIApplicationCommandChannelOption, APIApplicationCommandOptionChoice, APIApplicationCommandIntegerOption, APIApplicationCommandMentionableOption, APIApplicationCommandNumberOption, APIApplicationCommandRoleOption, APIApplicationCommandStringOption, APIApplicationCommandUserOption, APIApplicationCommandSubcommandGroupOption, APIApplicationCommandSubcommandOption, Permissions, RESTPostAPIChatInputApplicationCommandsJSONBody, APIApplicationCommandOption, Locale, ApplicationCommandType, RESTPostAPIContextMenuApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { JSONEncodable, Equatable } from '@discordjs/util';

declare module "discord.js"{
  export interface Client{
    commands: Collection<string, any>
  }

  export class CustomBallotSelectBuilder extends BaseSelectMenuBuilder<APIStringSelectComponent>{
     
  }
}
export const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  });

  registerEvents(client, Events)

  client.login(Keys.clientToken).catch((err) => {
    console.error("Login Error", err);
    process.exit(1);
  });