const Tables = [
    {
        name: "profiles",
        values: [
            'userid TEXT PRIMARY KEY',
            'points NUMBER NOT NULL DEFAULT \'0\''
        ]
    }
]

module.exports = Tables;