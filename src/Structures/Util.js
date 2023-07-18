const { InteractionType } = require('discord.js')
const Client = require('./Client');
const path = require('path')
const { glob } = require('glob')
const Command = require('./Command')
const Event = require('./Event')

module.exports = class Util {
    /**
     * Client Property
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client
    }
    get directory() {
        return `${path.dirname(require.main.filename)}${path.sep}`
    }
    minToMs(min) {
        return min * 60 * 1000
    }
    randomizeNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    titleCase(str) {
        return str.toLowerCase().replace(/_/g, " ").split(" ")
            .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
            .join(" ")
    }
    getRandomString(length, upperCase = false) {
        const randomChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += randomChars.charAt(
                Math.floor(Math.random() * randomChars.length),
            );
        }
        if (upperCase === true) return result.toUpperCase();
        else return result;
    }
    upperCase(str) {
        return str.toUpperCase().replace(/_/g, " ").split(" ")
            .join(" ")
    }
    async LoadCommands() {
        console.log(path.join(this.directory, "Commands", "**", "*.js"))
        glob(path.join(this.directory, "Commands", "**", "*.js")).then(async (slashFile) => {
            for (let cmds of slashFile) {
                delete require.cache[cmds];

                const File = require(cmds);

                const command = new File(this.client);
                if (!(command instanceof Command)) throw new TypeError("File located is not an instance of Command Class")

                this.client.commands.set(command.name, command);
            }
        }).catch((err) => {
            this.client.logger.error(err.stack);
            process.exit(1)
        })
    }
    async LoadEvents() {
        glob(path.join(this.directory, "Events", "**", "*.js")).then(async (eventFile) => {
            for (let event of eventFile) {
                delete require.cache[event];

                const File = require(event);

                const events = new File(this.client);
                if (events.disabled) continue;
                if (!(events instanceof Event)) throw new TypeError('File located is not an instance of Event Class');

                this.client.events.set(events.name, events);

                this.client[events.type](events.name, (...args) => events.callback(...args))
            }
        }).catch((err) => {
            this.client.logger.error(err.stack);
            process.exit(1)
        })
    }
    replyOrEdit(interaction) {
        let type = 'reply';
        if (interaction.deferred || interaction.replied) type = 'editReply'

        return type;
    }
    page(map, limit, joinStyle = '\n\n') {
        let pages = Math.ceil(map.length / limit) || 1;
        const results = [];

        for (let index = 0; index < pages; index++) {
            const index2 = index + 1;
            const start = (index2 * limit) - limit
            const end = index2 * limit;
            results.push(map.slice(start, end).join(joinStyle))
        }
        let page = 1;

        return {
            page,
            pages,
            results
        }
    }
    removeDuplicates(arr) {
        return [...new Set(arr)]
    }
    shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    trimArray(arr, maxLen = 10) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(` and ${len} more items...`);
        }
        return arr;
    }
    isOdd(x) {
        return !!(x & 1);
    }
    isApplicationCommand(interaction) {
        return interaction.type === InteractionType.ApplicationCommand;
    }
    isMessageComponent(interaction) {
        return interaction.type === InteractionType.MessageComponent;
    }
    isAutocomplete(interaction) {
        return interaction.type === InteractionType.ApplicationCommandAutocomplete;
    }
    isModalSubmit(interaction) {
        return interaction.type === InteractionType.ModalSubmit;
    }
}