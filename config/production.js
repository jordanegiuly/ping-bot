'use strict';

module.exports = () => {
    return {
        router: {
            googleapi: {
                credentials: {
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    redirect_uri: process.env.GOOGLE_REDIRECT_URI
                }
            },
            slackapi: {
                credentials: {
                    client_id: process.env.SLACK_CLIENT_ID,
                    client_secret: process.env.SLACK_CLIENT_SECRET
                }
            }
        }
    };
};
