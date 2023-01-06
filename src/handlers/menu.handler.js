const {ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, Component} = require("discord.js")
function menuTree(client){


    client.on("messageCreate", async (message) => {
        if(!message.content.includes('<@1017092115987169390>')) return;

        const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("primary")
                        .setLabel("Click if you dare")
                        .setStyle(ButtonStyle.Primary)
                );

        await message.reply({components: [row]})

        
    })
 




}

module.exports = {menuTree}