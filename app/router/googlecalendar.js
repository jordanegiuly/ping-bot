'use strict';

module.exports = (googleApi, config) => {
    const googleCalendarRouter = require('express').Router();

    googleCalendarRouter.use((req, res, next) => {
        req.client = googleApi.auth.client(config.credentials);
        next();
    });

    googleCalendarRouter.get('/authorize/:slackId', (req, res) => {
        const options = config.authUrl;
        options.state = req.params.slackId;
        const authUrl = googleApi.auth.url(req.client, options);
        res.redirect(authUrl);
    });

    googleCalendarRouter.get('/callback', (req, res) => {
        const code = req.query.code;
        const slackId = req.query.state;
        googleApi.auth.getNewToken(req.client, code)
        .then(userToken => {
            return googleApi.auth.saveToken(userToken, slackId);
        })
        .then(userToken => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
    });

    googleCalendarRouter.get('/ping/:slackId', (req, res) => {
        googleApi.auth.getToken(req.params.slackId)
        .then(userToken => {
            console.log('ping', req.params.slackId, userToken);
            req.client.credentials = userToken.token;
            googleApi.calendar.ping(req.client)
            .then(ping => {
                let response = '';
                if (ping.isAvailable) {
                    response = 'This mother fucker IS AVAILABLE';
                    if (ping.nextDateTime) {
                        response += ` until ${ping.nextDateTime}`;
                    }
                }
                else {
                    response = `This mother fucker is NOT available until ${ping.nextDateTime}`;
                }
                res.send(response);
            })
            .catch(err => {
                console.log(err);
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/');
        });
    });
    return googleCalendarRouter;
};
