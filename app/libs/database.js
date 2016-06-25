'use strict';

const _ = require('lodash');
let databases;
const fs = require('fs');
const databaseName = '.databases.json';

module.exports = () => {
    if (!databases) {
        load();
    }

    function load() {
        console.log('load database');
        if (fs.existsSync(databaseName)) {
            databases = JSON.parse(fs.readFileSync(databaseName));
        }
        else {
            databases = {};
        }
    }

    function get(slackId) {
        return new Promise((resolve, reject) => {
            resolve(_.get(databases, slackId.split(':')));
        });
    }

    function save({user, token}, slackId) {
        return new Promise((resolve, reject) => {
            _.set(databases, slackId.split(':'), {user, token});
            console.log('databases - save');
            fs.writeFileSync(databaseName, JSON.stringify(databases, null, 4));
            resolve({user, token});
        });
    }

    return {
        get,
        save
    };
};
