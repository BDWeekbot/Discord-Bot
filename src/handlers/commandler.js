
const {Collection, Events} = require("discord.js")
const fs = require("node:fs")
const path = require("node:path")

function Commandler(client) {
  // client.on("messageCreate", (msg) => {
  //   parseWeekbotCommand(msg);
  // });

  client.commands = new Collection();

  const commandsPath = path.join(__dirname, "../commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute in command") {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] the command at ${filePath} is missing a required property`
      );
    }
  }

  // new message listener
  client.on(Events.InteractionCreate, async interaction => {
    
    if (!interaction.isChatInputCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }
  
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  });
}

module.exports = { Commandler };
