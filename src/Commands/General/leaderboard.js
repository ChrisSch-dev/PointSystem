const Command = require('../../Structures/Command');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "leaderboard",
            description: "Display points leaderboard",
            category: "General",
            offerSlash: true,
        })
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
        this.createSlash(builder);
    }
    async execute(interaction) {
        await interaction.deferReply();

        const docs = await this.client.database.query(`SELECT * FROM profiles`);
        const row = new ActionRowBuilder()

        if (!docs || !docs.rows[0]) return interaction.editReply({
            content: "Leaderboard is not available in this server yet!"
        });

        const mapping = await Promise.all(docs.rows
            .sort((a, b) => b.points - a.points)
            .filter(c => c.points > 0)
            .map(async (c, index) => `${0 + (++index)}) **${this.client.users.cache.get(c.userid)?.username || (await this.client.users.fetch(c.userid)).username}:** ${c.points > 1000 ? "1000+" : c.points} Pts`)
        )


        const toPaginate = this.client.util.page(mapping, 5, '\n');
        const { results, page, pages } = toPaginate;

        const embed = this.client.ehandler.embed(interaction)
            .setTitle('Leaderboard')
            .setDescription(`${results[page - 1] || "No Data Found On This Page"}`)
            .setFooter({ text: `Requested By: ${interaction.user.tag} | Page ${page} of ${pages}`, iconURL: interaction.user.avatarURL({ dynamic: true }) })

        row.addComponents([
            new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel('First').setCustomId('first'),
            new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel('Back').setCustomId('back'),
            new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel('Next').setCustomId('next'),
            new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel('Last').setCustomId('last'),
            new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel('Del').setCustomId('del')
        ])

        const msg = await interaction.editReply({
            embeds: [embed],
            components: [row]
        });

        const collector = msg.createMessageComponentCollector({
            time: 60000
        });

        collector.on('collect', async (i) => {
            await i.deferUpdate();

            let id = interaction.user.id;
            if (i.user.id !== id) return;
            const name = i.customId;

            switch (name) {
                case 'del':
                    await msg.edit({
                        embeds: [this.client.ehandler.custom().setDescription('**Result Closed By Command Author**').setColor(this.client.config.colors.failed)],
                        components: []
                    })
                    collector.stop('del');

                    break;
                case 'first':
                    page = 1;
                    break;
                case 'back':
                    page--;
                    break;
                case 'next':
                    page++;
                    break;
                case "last":
                    page = pages;
                    break;
            }

            if (page <= 0) {
                page = pages;
            } else if (page > pages) {
                page = 1;
            }

            embed
                .setDescription(`${results[page - 1] || "No Data Found"}`)
                .setFooter({ text: `Requested By: ${interaction.user.tag} | Page ${page} of ${pages}`, iconURL: interaction.user.avatarURL({ dynamic: true }) })

            if (name !== 'del') await msg.edit({ embeds: [embed] });
        })

        collector.on('end', async (_, reason) => {
            if (reason === 'time') return msg.edit({
                components: []
            }).catch(() => { })
        })

    }
}
