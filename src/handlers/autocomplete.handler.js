
function autocompleteHandler(client){

    client.on('interactionCreate', async interaction => {
        if (interaction.isChatInputCommand()) {
            // command handling
        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);
    
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
    
            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }
        }
    });

}

module.exports = {autocompleteHandler}