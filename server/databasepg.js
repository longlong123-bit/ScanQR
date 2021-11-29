const Pool = require('pg').Pool

const pool = new Pool({
    host: 'localhost',
    user: 'odoo13',
    password: 'odoo13',
    port: 5432,
    database: 'postgres'
})
module.exports = pool