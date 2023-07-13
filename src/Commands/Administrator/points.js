const Command = require('../../Structures/Command');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "points",
            description: "Manages a member's points",
            category: "Administrator",
            offerSlash: true,
            userPermissions: ['Administrator']
        })
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addSubcommand(opt =>
                opt.setName('set')
                    .setDescription('Set the specified member\'s points')
                    .addUserOption(opt => opt.setName('member').setDescription('Select a member!').setRequired(true))
                    .addIntegerOption(opt => opt.setName('value').setDescription('New point value to set').setRequired(true))
            )
            .addSubcommand(opt =>
                opt.setName('add')
                    .setDescription('Add specific amount of points to a member')
                    .addUserOption(opt => opt.setName('member').setDescription('Select a member!').setRequired(true))
                    .addIntegerOption(opt => opt.setName('value').setDescription('Values to add').setRequired(true))
            )
            .addSubcommand(opt =>
                opt.setName('remove')
                    .setDescription('Remove specific amount of points to a member')
                    .addUserOption(opt => opt.setName('member').setDescription('Select a member!').setRequired(true))
                    .addIntegerOption(opt => opt.setName('value').setDescription('Values to remove').setRequired(true))
            )
        this.createSlash(builder);
    }
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const user = interaction.options.getUser('member');
        const integer = interaction.options.getInteger('value');

        const uData = await this.client.database.fetchProfile(user.id) || await this.client.database.createProfile(user.id);

        if (sub === 'set') {
            uData.points = integer;
        } else if (sub === 'add') {
            uData.points = uData.points + integer;
        } else if (sub === 'remove') {
            uData.points = uData.points - integer;
        }

        await this.client.database.updateProfile(user.id, ['points'], [uData.points]);

        interaction.reply({
            content: `✅ Successfully updated ${user.username}'s points.`
        })
    }
}