const Tables = require('./Schemas');
const pg = require('pg');
const Client = require('./Client')

module.exports = class Database {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client;
        this.manager = new pg.Client(this.client.config.database);

        this.manager.on('end', () => {
            this.client.logger.log('PostgreSQL - WARN', 'Disconnected from PostgreSQL Database!')
        })

        this.manager.on('error', (err) => {
            this.client.logger.error(err.stack)
        });
    }
    async connect() {
        this.client.logger.log('PostgreSQL', 'Connecting to PostgreSQL Database')
        await this.manager.connect(err => {
            if (err) {
                this.client.logger.log('PostgreSQL', 'Failed to establish a connection to PostgreSQL Database')
                this.client.logger.error(err.stack)
                return
            };
            this.client.logger.log('PostgreSQL', 'Successfully connected to PostgreSQL Database')
        })

        await Promise.all([
            Tables.map(({ name, values }) => { return this.manager.query(`CREATE TABLE IF NOT EXISTS ${name}(${values.join(', ')})`) }),
        ]).catch(this.client.logger.error)
    }
    async query(query = '', values = []) {
        const result = await this.manager.query(query, values).catch(err => {
            console.log(query);
            this.client.logger.error(err.stack)
        })

        if (!result) return null;

        return result;
    }
    async fetchProfile(userid) {
        const doc = await this.query(`SELECT * FROM profiles WHERE userid = $1`, [userid]);
        if (!doc || !doc.rows[0]) return null;

        return doc.rows[0];
    }
    async createProfile(userid, columns = [], values = []) {
        const doc = await this.query(`SELECT * FROM profiles WHERE userid = $1`, [userid]);

        if (!doc || doc.rows[0]) return null;

        const column = columns.map(str => `"${str}"`).join(', ');
        const value = values.map((_v, index) => `$${index + 1}`).join(', ');

        const created = await this.query(
            `INSERT INTO profiles(${column ? `${column},` : ''}userid) VALUES(${value ? `${value},` : ""}$${values.length + 1}) RETURNING *`,
            [...values, userid]
        );

        if (!created) return null;

        return created.rows[0];
    }
    async updateProfile(userid, columns = [], values = []) {
        const result = await this.query(
            `UPDATE profiles SET ${columns.map((str, index) => `"${str}" = $${index + 1}`).join(', ')} WHERE userid = $${values.length + 1} RETURNING *`,
            [...values, userid]
        )

        return result.rows[0];
    }
    async deleteProfile(userid) {
        await this.query(`DELETE FROM profiles WHERE userid = $1`, [userid])
    }
}