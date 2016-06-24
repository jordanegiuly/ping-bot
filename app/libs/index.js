'use strict';

module.exports = () => {
    const googleapi = require('./googleapi')();
    const slackApi = require('./slackapi')();
    return {googleapi, slackApi};
};
