/* eslint-disable no-useless-escape */
const Event = require('../../Structures/Event');
const { ChannelType } = require('discord.js');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "messageCreate",
            once: false,
            disabled: false
        })
    }
    async callback(message) {
        if (message.author.bot || [ChannelType.DM, ChannelType.GuildForum].includes(message.channel.type) || message.system) return;

        const prefix = '!';
        if (!message.content.startsWith(prefix) || !this.client.config.owners.includes(message.author.id)) return;
        const args = message.content.substring(prefix.length).split(' ');
        const cmd = args.shift().toLowerCase();
        const get = this.client.commands.get(cmd);
        if (get) {
            if (!get.devOnly) return;

            try {
                await get.runLegacy({ args, message });
                this.client.logger.log(`Command Processor`, `Received (-) ${cmd}, U${message.author.id}, G${message.guild.id}`)
            } catch (err) {
                this.client.logger.error(err.stack)

                message.reply({
                    embeds: [this.client.ehandler.error.faultyError(err)]
                })
            }
        }
    }
}