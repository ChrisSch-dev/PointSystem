module.exports = {
    owners: ['OWNER_ID'],
    database: {
        host: "DB_IP",
        port: "DB_PORT",
        password: "DB_PW",
        database: "pointsystem",
        idle_in_transaction_session_timeout: 30000,
        user: "DB_USER"
    },
    colors: {
        default: 0x5865F2,
        main: 0x292B2F,
        failed: 0xD53B3E,
        green: 0x3FF076,
    },
}
