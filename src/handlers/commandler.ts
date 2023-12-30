import { Client, Collection, Events, Interaction } from "discord.js";
import "ts-node/register"
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

export async function  Commandler(client: Client){
  
    client.commands = new Collection();

    const commandsPath = path.join(__dirname, "../commands");
    const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);

    if (command.default.data) {
    
        client.commands.set(command.default.data.name, command.default);
    } else {
        console.log(
        `[WARNING] the command at ${filePath} is missing a required property`
        );
    }
    }

    

    client.on(Events.InteractionCreate,async (interaction:Interaction) => {
        console.log("interaction")
        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);
        console.log(interaction.isChatInputCommand)
        if(!command) {
            console.error(`No Command Matching ${interaction.commandName} Was Found`)
            return
        }

        try{
            console.log("command execute")
            await command.execute(interaction, client);
           
        } catch(err){
            console.error(err)
            await interaction.reply({content: "There was an error while execution this command"})
        }
       

    })
}