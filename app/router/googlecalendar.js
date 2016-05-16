module.exports = (googleApi, config) => {
    const googleCalendarRouter = require('express').Router();

    googleCalendarRouter.use((req, res, next) => {
        req.client = googleApi.auth.client(config.credentials);
        next();
    });

    googleCalendarRouter.get('/authorize', (req, res) => {
        const authUrl = googleApi.auth.url(req.client, config.authUrl);
        res.redirect(authUrl);
    });

    googleCalendarRouter.get('/callback', (req, res) => {
        const code = req.query.code;
        googleApi.auth.getNewToken(req.client, code)
        .then(userToken => {
            return googleApi.auth.saveToken(userToken, config.tokenDir);
        })
        .then(userToken => {
            res.redirect(`ping/${userToken.user.id}`);
        })
        .catch(err => {
            console.log(err);
        });
    });

    googleCalendarRouter.get('/ping/:id', (req, res) => {
        googleApi.auth.getToken(req.params.id, config.tokenDir)
        .then(userToken => {
            req.client.credentials = JSON.parse(userToken).token;
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
            res.redirect('/googlecalendar/authorize');
        });
    });
    return googleCalendarRouter;
};
