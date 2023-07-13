/* eslint-disable no-unused-vars */
const Client = require('./Client');

/**
 * @typedef {Object} Options
 * @property {?string} name
 * @property {?boolean} once
 * @property {?boolean} disabled
*/

module.exports = class Event {
    /**
     * Base Event Configuration
     * @param {Client} client Client
     * @param {Options} options Options
     */
    constructor(client, options) {
        this.client = client;

        this.name = options.name;

        this.type = options.once ? 'once' : 'on'

        this.disabled = options.disabled || false;
    }
    /**
     * Callback function to execute the event
     * @param  {...any} args Args
     */
    async callback(...args) {
        throw new Error(`The callback method has not been implemented in ${this.name}`);
    }
}