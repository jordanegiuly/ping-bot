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
        console.log(_.keys(databases).length + ' teams loaded.');
    }

    function get(slackId) {
        return new Promise((resolve, reject) => {
            resolve(_.get(databases, slackId.split(':')));
        });
    }

    function save({user, token}, slackId) {
        return new Promise((resolve, reject) => {
            _.set(databases, slackId.split(':'), {user, token});
            console.log('databases - new entry for', slackId);
            fs.writeFileSync(databaseName, JSON.stringify(databases, null, 4));
            resolve({user, token});
        });
    }

    return {
        get,
        save
    };
};
