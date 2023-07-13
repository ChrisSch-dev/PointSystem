const { PermissionsBitField, ChannelType } = require('discord.js');
const { RESTJSONErrorCodes } = require('discord-api-types/v10')
const Event = require('../../Structures/Event');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "interactionCreate",
            disabled: false,
            once: false,
        })
    }
    async callback(interaction) {
        const { member, guild, user, channel } = interaction;

        if (!this.client.util.isApplicationCommand(interaction) && !this.client.util.isMessageComponent(interaction)) return;
        if ([ChannelType.DM, ChannelType.GuildForum].includes(channel.type)) return;

        const cmd = this.client.commands.get(interaction.commandName);
        
        await this.client.database.fetchProfile(user.id) || await this.client.database.createProfile(user.id);

        if (cmd.devOnly && !this.client.config.owners.includes(user.id)) return interaction.reply({
            embeds: [this.client.ehandler.error.cmdError('This command is only available to Bot Owners')],
        })

        try {
            const userperms = cmd.userPermissions;
            const botPerms = cmd.botPermissions;

            if (userperms) {
                const missing = [];
                const permissions = channel.permissionsFor(member);
                for (const perm of userperms) {
                    if (!permissions.has(PermissionsBitField.Flags[perm]) && !this.client.config.owners.includes(user.id)) {
                        missing.push(perm)
                    }
                }
                if (missing.length) return interaction.reply({
                    embeds: [this.client.ehandler.error.missingPerms(missing.join(', '))]
                })
            }

            if (botPerms) {
                const missing = [];
                const permissions = channel.permissionsFor(guild.members.me);

                for (const perm of botPerms) {
                    if (!permissions.has(PermissionsBitField.Flags[perm])) {
                        missing.push(perm)
                    }
                }
                if (missing.length) return interaction.reply({
                    embeds: [this.client.ehandler.error.clientMissingPerms(missing.join(','))]
                })
            }

            await cmd.execute(interaction)
            this.client.logger.log(`Command Processor ${interaction.id}`, `Received (/) ${interaction.commandName}, U${user.id}, G${guild.id}`)
        } catch (e) {
            if ([RESTJSONErrorCodes.UnknownInteraction].includes(e.code)) return;
            this.client.logger.error(e.stack);

            await interaction[this.client.util.replyOrEdit(interaction)]({
                embeds: [this.client.ehandler.error.faultyError(e)]
            })
        }
    }
}