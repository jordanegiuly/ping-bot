'use strict';

module.exports = () => {
    const slackRouter = require('express').Router();

    slackRouter.post('/ping', (req, res) => {
        const body = req.body;
        if (body.token && body.token === process.env.SLACK_TOKEN) {
            res.status(200).json({
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
