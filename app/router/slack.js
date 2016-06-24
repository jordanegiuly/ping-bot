'use strict';
const request = require('request');

module.exports = (slackApi, config) => {
    const slackRouter = require('express').Router();

    slackRouter.get('/', (req, res) => {
        const code = req.query.code;
        slackApi.exchangeCodeForToken(code, config.credentials)
        .then(token => {
            res.status(200).send('OK');
        })
        .catch(err => {
            res.status(500).send('KO');
        });
    });

    slackRouter.post('/ping', (req, res) => {
        const body = req.body;
        // console.log('body', body);
        if (body.token === process.env.SLACK_TOKEN) { // TODO: promise + new errors
            const teamId = body.team_id;
            const userToPing = body.text;
            if (slackApi.isValid(userToPing)) {
                const slackId = slackApi.getSlackId({teamId, userToPing});
                slackApi.hasAuthorized(slackId)
                .then(hasAuthorized => {
                    if (hasAuthorized) {
                        request.get('/googlecalendar/ping/' + slackId)
                        .then(response => {
                            console.log(response.body);
                            res.status(200).json({
                                text: response
                            });
                        });
                    } else {
                        res.status(200).json({
                            response_type: 'in_channel', // for virality
                            text: userToPing + ' has not authorized /ping yet.',
                            attachments: [
                                {
                                    text: 'Send him this link: https://bot-ping.herokuapp.com/googlecalendar/authorize/' + teamId + '/' + userToPing
                                }
                            ]
                        });
                    }
                });
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
