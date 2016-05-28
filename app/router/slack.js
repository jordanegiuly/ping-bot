'use strict';

module.exports = () => {
    const slackRouter = require('express').Router();

    slackRouter.post('/ping', (req, res) => {
        console.log('req.body', req.body);
        res.send(req.body);
    });

    return slackRouter;
};
