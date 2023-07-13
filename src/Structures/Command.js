const { CommandInteraction } = require('discord.js');
const Client = require('./Client');

/**
 * @typedef {Object} Options
 * @property {?string} name
 * @property {?string} description
 * @property {?string} category
 * @property {?boolean} offerSlash
 * @property {?import('discord.js').PermissionsString[]} userPermissions
 * @property {?import('discord.js').PermissionsString[]} botPermissions
 * @property {?text[]} usage
 * @property {?boolean} nsfw
 * @property {?boolean} devOnly
 */

module.exports = class Command {
    /**
     * Base Command Configuration
     * @param {Client} client Client
     * @param {Options} options Options
     */
    constructor(client, options) {
        this.client = client;

        this.builder = null;

        this.name = options.name;

        this.description = options.description || "A command to do fun stuff!"

        this.category = options.category;

        this.offerSlash = options.offerSlash || false;

        this.userPermissions = options.userPermissions || [];

        this.botPermissions = options.botPermissions || [];

        this.usage = options.usage || [];

        this.nsfw = options.nsfw || false;

        this.devOnly = options.devOnly || false;
    }
    /**
     * Execute Function to execute the command
     * @param {CommandInteraction} interaction Interaction
     * @param {...args} args Args
     */
    async execute(interaction, ...args) {
        throw new Error(`[Commands ${this.name}] The execute method has not been configured`)
    }
    /**
     * runLegacy function to execute Run Legacy
     * @param {ctx} ctx ctx
     */
    async runLegacy(ctx) {
        throw new Error(`[Commands ${this.name}] The runLegacy method has not been configured`)
    }
    createSlash(builder) {
        this.builder = builder;
    }
}