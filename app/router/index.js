'use strict';

const slackButton = '<a href="https://slack.com/oauth/authorize?scope=commands&client_id=20872315939.46506921396"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>'

module.exports = (libs, config) => {
    const router = require('express').Router();
    const googlecalendar = require('./googlecalendar')(libs.googleapi, config.googleapi);
    const slack = require('./slack')(libs.slackApi);

    router.get('/', (req, res) => {
        res.send('<h1>Hello world!</h1>' + slackButton);
    });
    router.use('/googlecalendar', googlecalendar);
    router.use('/slack', slack);
    return router;
};
