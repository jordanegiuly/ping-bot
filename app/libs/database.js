'use strict';

const _ = require('lodash');
const databases = {};

module.exports = () => {
    function get(slackId) {
        return new Promise((resolve, reject) => {
            resolve(_.get(databases, slackId.split(':')));
        });
    }

    function save({user, token}, slackId) {
        return new Promise((resolve, reject) => {
            _.set(databases, slackId.split(':'), {user, token});
            resolve({user, token});
        });
    }

    return {
        get,
        save
    };
};
