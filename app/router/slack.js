'use strict';
const request = require('request');

module.exports = () => {
    const slackRouter = require('express').Router();

    slackRouter.post('/ping', (req, res) => {
        const slack_response = req.body;
        console.log(slack_response.token);
        request.post(slack_response.response_url,
            {form: 'OK'}, (err, resp, body) => {
                console.log('err', err);
                console.log('resp', resp.statusCode);
                console.log('body', body);
                res.send('OK');
        });
    });

    return slackRouter;
};
