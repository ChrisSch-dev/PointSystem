module.exports = class Logger {
    constructor(client) {
        this.client = client
    }
    log(title, content) {
        console.log(`[Process ${process.pid}] [${title}] » ${content}`)
    }
    error(...error) {
        console.error(`[Process ${process.pid}] [Error]  »`, ...error.map(err2 => err2.stack || err2))
    }
    debug(title, content) {
        console.log(`[Process ${process.pid}] [${title} - Debug] » ${content}`)
    }
}