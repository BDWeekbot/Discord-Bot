import { REST } from 'discord.js';
import { Routes } from 'discord-api-types/v10';
import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';
import { resolve } from "path";

const EnvFile = process.env.NODE_ENV === "development" ? ".dev.env" : ".env";

const EnvFilePath = resolve(process.cwd(), EnvFile)

dotenv.config({path: EnvFilePath})


const ENVtoken: string | undefined = process.env.token;
const token: string = ENVtoken!;
const ENVclientId: string | undefined = process.env.clientId;
const clientId: string = ENVclientId!;
const ENVguildId: string | undefined = process.env.guildId; // change in env for development on a private server
const guildId: string = ENVguildId!;


const commands: any[] = [];
// Grab all the command files from the commands directory
const commandFiles: string[] = await fs.readdir('./dist/commands').then(files => files.filter(file => file.endsWith('.js') || file.endsWith('.ts')));
console.log(commandFiles)
// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  console.log(command)
  commands.push(command.default.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    console.log(clientId, guildId)
    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
