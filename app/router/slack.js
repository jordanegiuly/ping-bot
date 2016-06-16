'use strict';

const request = require('request');

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
        console.log('body', body);
        if (body.token === process.env.SLACK_TOKEN) {
            // todo set content-type to application/json
            res.status(200).json({
                response_type: 'in_channel', // for virality
                text: body.text + ' has not authorized /ping yet.',
                attachments: [
                    {
                        text: 'Send him this link: https://bot-ping.herokuapp.com/'
                    }
                ]
            });
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
