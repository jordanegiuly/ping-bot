'use strict';

module.exports = () => {
    const googleCredentials = require('../.auth/googleapi.json');
    const slackCredentials = require('../.auth/slackapi.json');
    return {
        router: {
            googleapi: {
                credentials: {
                    client_id: googleCredentials.web.client_id,
                    client_secret: googleCredentials.web.client_secret,
                    redirect_uri: googleCredentials.web.redirect_uris[0]
                }
            },
            slackapi: {
                client_id: slackCredentials.client_id,
                client_secret: slackCredentials.client_secret
            }
        }
    };
};
