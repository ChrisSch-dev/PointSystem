const { EmbedBuilder } = require('discord.js')

module.exports = class ErrorHandler {
    constructor(client) {
        this.client = client
    }
    missingArgs(usage, prefix) {
        return new EmbedBuilder()
            .setAuthor({ name: 'Missing Arguments', iconURL: this.client.user.avatarURL() })
            .setDescription(`:x: You have missing some command arguments.`)
            .addFields([
                {
                    name: "Missing Argument(s)",
                    value: usage.map(c => `${prefix}${c}`).join('\n')
                }
            ])
            .setFooter({ text: `${this.client.user.username}`, iconURL: this.client.user.avatarURL() })
            .setTimestamp()
            .setColor(this.client.config.colors.failed)
    }
    missingPerms(permission) {
        return new EmbedBuilder()
            .setAuthor({ name: 'Command Execution Failed', iconURL: this.client.user.avatarURL() })
            .setDescription(`:x: You have insufficient permissions to use this command.`)
            .addFields([
                {
                    name: "Missing Permission(s)",
                    value: permission
                }
            ])
            .setFooter({ text: `${this.client.user.username}`, iconURL: this.client.user.avatarURL() })
            .setTimestamp()
            .setColor(this.client.config.colors.failed)
    }
    clientMissingPerms(permission) {
        return new EmbedBuilder()
            .setAuthor({ name: 'Command Execution Failed', iconURL: this.client.user.avatarURL() })
            .setDescription(`:x: I have insufficient permissions to use this command.`)
            .addFields([
                {
                    name: "Missing Permission(s)",
                    value: permission
                }
            ])
            .setColor(this.client.config.colors.failed)
            .setFooter({ text: `${this.client.user.username}`, iconURL: this.client.user.avatarURL() })
            .setTimestamp()
    }
    cmdError(expmsg) {
        return new EmbedBuilder()
            .setAuthor({ name: 'Command Error', iconURL: this.client.user.avatarURL() })
            .setDescription(`:x: ${expmsg}`)
            .setColor(this.client.config.colors.failed)
            .setFooter({ text: `${this.client.user.username}`, iconURL: this.client.user.avatarURL() })
            .setTimestamp()
    }
    categorydisabled(category) {
        return new EmbedBuilder()
            .setAuthor({ name: 'Category Disabled', iconURL: this.client.user.avatarURL() })
            .setDescription(`:x: The **${category}** category is currently **Disabled** in this server.\nPlease contact a Server Administrator for more information.`)
            .setColor(this.client.config.colors.failed)
            .setFooter({ text: `${this.client.user.username}`, iconURL: this.client.user.avatarURL() })
            .setTimestamp()
    }
    alreadydisabled(module) {
        return new EmbedBuilder()
            .setAuthor({ name: 'Already Disabled', iconURL: this.client.user.avatarURL() })
            .setDescription(`:x: The **${module}** category is already disabled in this server!`)
            .setColor(this.client.config.colors.failed)
            .setFooter({ text: `${this.client.user.username}`, iconURL: this.client.user.avatarURL() })
            .setTimestamp()
    }
    alreadyenabled(module) {
        return new EmbedBuilder()
            .setAuthor({ name: 'Already Enabled', iconURL: this.client.user.avatarURL() })
            .setDescription(`:x: The **${module}** category is already enabled in this server!`)
            .setColor(this.client.config.colors.failed)
            .setFooter({ text: `${this.client.user.username}`, iconURL: this.client.user.avatarURL() })
            .setTimestamp()
    }
    faultyError(err) {
        return this.cmdError('Something went wrong while executing this command!').addFields([
            {
                name: "Excpection Status",
                value: "Exception Logged to Logs.",
                inline: true
            },
            {
                name: "Error Code",
                value: `${err.code || "Not Available"}`,
                inline: true
            },
            {
                name: "Error Message",
                value: `\`\`\`\n${err.message}\n\`\`\``
            }
        ])
    }
}