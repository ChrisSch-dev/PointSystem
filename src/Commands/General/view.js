const Command = require('../../Structures/Command');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "view",
            description: "View a member's points",
            category: "General",
            offerSlash: true,
        })
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(opt => opt.setName('member').setDescription('Select a member!').setRequired(false))
        this.createSlash(builder);
    }
    async execute(interaction) {
        const user = interaction.options.getUser('member') || interaction.user;

        const uData = await this.client.database.fetchProfile(user.id);

        interaction.reply({
            content: `${user.username} has \`${uData ? uData.points : "0"}\` points`
        })
    }
}