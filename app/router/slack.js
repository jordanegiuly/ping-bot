'use strict';
const request = require('request');

module.exports = () => {
    const slackRouter = require('express').Router();

    slackRouter.post('/ping', (req, res) => {
        const body = req.body;
        if (body.token && body.token === process.env.SLACK_TOKEN) {
            res.status(200).send(body.text + ' not available.');
        }
        else {
            res.status(401).send('Unauthorized');
        }
        // request.post(body.response_url,
        //     {form: {text: 'OK'}}, (err, resp, body) => {
        //         console.log('err', err);
        //         console.log('resp', resp.statusCode);
        //         console.log('body', body);
        //         res.send('OK');
        // });
    });

    return slackRouter;
};
