'use strict';

const request = require('request');
const database = require('./database')();

module.exports = () => {
    function isValid(text) {
        const reg = /^@[\S]*$/g;
        return !!text.match(reg);
    }

    function exchangeCodeForToken(code, credentials) {
        return new Promise((resolve, reject) => {
            request.post('https://slack.com/api/oauth.access', {
                form: {
                    code,
                    client_id: credentials.client_id,
                    client_secret: credentials.client_secret
                }
            }, (err, res, body) => {
                // console.log('body', body);
                if (body.ok) {
                    resolve(body);
                } else {
                    // console.log('err', err);
                    reject(err);
                }
            });
        });
    }

    function getSlackId({teamId, userToPing}) {
        // TODO base64 hash
        return [teamId, userToPing].join(':');
    }

    function hasAuthorized(slackId) {
        return database.get(slackId)
        .then(user => {
            return !!user;
        });
    }

    return {
        isValid,
        getSlackId,
        hasAuthorized,
        exchangeCodeForToken
    };
};
