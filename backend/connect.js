const Pool = require('pg').Pool;
const pool = new Pool({
    user: '*********',
    host: '10.5.18.69',
    database: '*********',
    password: '*********',


});

module.exports = {
    query: (text, params) => {
        return pool.query(text, params);
    },
};