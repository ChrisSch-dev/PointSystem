require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const Logger = require('./Logger')
const Util = require('./Util')
const Database = require('./Database')
const EmbedHandler = require('./EmbedHandler')

module.exports = class PointSystem extends Client {
    constructor() {
        super({
            allowedMentions: {
                parse: ['users'],
                repliedUser: false,
            },
            partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember],
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildVoiceStates
            ]
        })

        this.debug = false;
        this.config = require('../config');

        this.logger = new Logger(this)
        this.util = new Util(this)
        this.database = new Database(this)
        this.ehandler = new EmbedHandler(this)

        this.commands = new Collection()
        this.events = new Collection()
    }
    async init() {
        await this.util.LoadCommands()
        await this.util.LoadEvents()
        await this.database.connect()

        await super.login(process.env.BOT_TOKEN)

        return this;
    }
}