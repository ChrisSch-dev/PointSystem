const Command = require("../../Structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'reloadc',
            description: 'Reload the specified Slash Command (Developer Only)',
            category: 'Owner',
            devOnly: true,
            usage: ['reloadc global', 'reloadc file <command_name>'],
        })
    }
    async runLegacy({ res, args, message }) {
        const sub = args[0]
        let str = args.slice(1).join(' ')

        if (!sub || !['file', 'slash', 'client'].includes(sub)) return message.reply({
            embeds: [this.client.ehandler.error.missingArgs(this.usage, '-')]
        })

        if (sub === 'file') {
            if (!str) return message.reply({
                embeds: [this.client.ehandler.error.missingArgs(this.usage, '-')]
            })

            const result = this.client.commands.get(str);

            if (!result) return message.reply({
                content: 'That is not a valid Slash Command!',
                ephemeral: true
            })

            const name = result.name
            const category = result.category

            try {
                delete require.cache[require.resolve(`../${category}/${name}`)]

                await this.client.commands.delete(name);

                const pull = require(`../${category}/${name}`);
                const classFile = new pull(this.client)
                this.client.commands.set(classFile.name, classFile);

                return message.reply({
                    content: `Successfully reloaded **${name}.js** with no errors`,
                    ephemeral: true
                })
            } catch (e) {
                return message.reply({
                    content: `Something went wrong while reloading this command!\nError: ${e.message}`,
                    ephemeral: true
                })
            }
        } else if (sub === 'slash') {
            this.client.logger.log(`SlashCommands`, 'Updating Client Slash Commands')

            const commands = [...this.client.commands.values()];
            const filter = commands.filter(c => c.offerSlash === true)
            const cmds = filter.map(cmd => cmd.builder.toJSON());

            try {
                await this.client.application.commands.set(cmds);
            } catch (err) {
                this.client.logger.error('SlashCommands', 'Failed to update Slash Commands')
                console.error(err)

                message.reply({
                    content: `:x: Something went wrong while updating the Client Slash Commands`
                })
                return;
            }

            this.client.logger.log('SlashCommands', 'Successfully updated Client Slash Commands');
            message.reply({
                content: ` Successfully updated Client Slash Commands! Changes can take upto 1 hour to be updated in all guilds!`
            })
        } else if (sub === 'client') {
            process.exit(1);
        }
    }
}