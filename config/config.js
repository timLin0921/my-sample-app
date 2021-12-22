const dotenv = require('dotenv');

const config = dotenv.config().parsed;
const envs = {...config, ...process.env};

module.exports = envs;
