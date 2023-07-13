const Event = require("../Structures/Event");

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: "ready",
            once: true,
        })
    }
    async callback() {
        this.client.logger.log('Client', `${this.client.user.tag} is Ready!`)
    }
}