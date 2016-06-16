'use strict';

const request = require('request');
const Regex = require('regex');

module.exports = () => {
    const slackRouter = require('express').Router();

    slackRouter.get('/', (req, res) => {
        const code = req.query.code;
        exchangeCodeForToken(code, (err, token) => {
            if (err) {
                res.status(500).send('KO');
            }
            res.status(200).send('OK');
        });
    });

    slackRouter.post('/ping', (req, res) => {
        const body = req.body;
        if (body.token === process.env.SLACK_TOKEN) {
            const teamId = body.team_id;
            const userToPing = body.text;
            if (isValid(userToPing)) {
                if (hasAuthorized({teamId, userToPing})) {
                    res.status(200).json({
                        text: userToPing + ' is available.' // TODO
                    });
                } else {
                    res.status(200).json({
                        response_type: 'in_channel', // for virality
                        text: userToPing + ' has not authorized /ping yet.',
                        attachments: [
                            {
                                text: 'Send him this link: https://bot-ping.herokuapp.com/' + teamId + '/' + userToPing
                            }
                        ]
                    });
                }
            } else {
                res.status(400).send('Invalid request.');
            }
        }
        else {
            res.status(401).send('Unauthorized');
        }
    });

    return slackRouter;
};

function exchangeCodeForToken(code, cb) {
    request.post('https://slack.com/api/oauth.access', {
        form: {
            code,
            client_id: '20872315939.46506921396',
            client_secret: '88d5e04b440846506a5633dc952d0e17'
        }
    }, (err, res, body) => {
        console.log('body', body);
        if (body.ok) {
            return cb(null, body);
        } else {
            console.log('err', err);
            return cb(err, null);
        }
    });
}

function isValid(text) {
    const validRegex = new Regex(/\A@[\S]*\z/);
    return validRegex.test(text);
}

// TODO
function hasAuthorized({teamId, userToPing}) {
    return false;
}

// {
//     token: 'jJJ2hkWe0rmi7uIK6e3dAtJK',
//     team_id: 'T0LRN99TM',
//     team_domain: 'les-affreux',
//     channel_id: 'D0TDD2NF2',
//     channel_name: 'directmessage',
//     user_id: 'U0LRR2V26',
//     user_name: 'jordane',
//     command: '/ping',
//     text: 'nicho',
//     response_url: 'https://hooks.slack.com/commands/T0LRN99TM/51646707250/ZmTdIzORebzlsfZB8ji2QL2a'
// }
