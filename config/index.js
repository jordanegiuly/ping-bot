const _ = require('lodash');

module.exports = () => {
    const config = require('./config.json');
    const env = process.env.NODE_ENV || 'development';
    const envConfig = require(`./${env}`)();
    return _.merge(config, envConfig);
};
