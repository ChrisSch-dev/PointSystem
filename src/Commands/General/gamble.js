const Command = require('../../Structures/Command');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "gamble",
            description: "Gamble your points away for a chance to get more or less points",
            category: "General",
            offerSlash: true,
        })
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
        this.createSlash(builder);
    }
    async execute(interaction) {
        const uData = await this.client.database.fetchProfile(interaction.user.id) || await this.client.database.createProfile(interaction.user.id);

        if (uData.points < 30) return interaction.reply({
            content: "You need to have atleast 30 points in order to run this command!"
        });

        const incOrDec = ['inc', 'dec'][Math.floor(Math.random() * 2)];
        const amount = this.client.util.randomizeNumber(1, 100);

        uData.points = incOrDec === 'inc' ? uData.points + amount : uData.points - amount;
        await this.client.database.updateProfile(interaction.user.id, ['points'], [uData.points])

        interaction.reply({
            content: `You ${incOrDec == 'inc' ? "Won" : "Lost!"}\nYour points are ${incOrDec == 'inc' ? "increased" : 'decreased'} by ${amount}`
        })

    }
}