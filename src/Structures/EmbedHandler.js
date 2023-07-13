const Client = require('./Client')
const ErrorEmbeds = require('../Utils/Core/ErrorEmbeds')
const CustomEmbed = require('./CustomEmbed')
const { Message } = require('discord.js');

module.exports = class EmbedHandler {
    /**
     * Client Property
     * @param {Client} client Client
     */
    constructor(client) {
        this.client = client;

        this.error = new ErrorEmbeds(this.client)
    }
    /**
     * Returns a CustomEmbed Class
     * @returns {CustomEmbed}
     */
    custom() {
        return new CustomEmbed()
    }
    embed(interaction) {
        const type = interaction instanceof Message ? "author" : "user"

        return this.custom()
            .setColor(this.client.config.colors.default)
            .setAuthor(interaction[type].tag, interaction[type].avatarURL({ dynamic: true }))
            .setFooter(this.client.user.tag, this.client.user.avatarURL({ dynmaic: true }))
            .setTimestamp()
    }
}