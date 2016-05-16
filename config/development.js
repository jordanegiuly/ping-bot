module.exports = () => {
    const credentials = require('../.auth/googleapi.json');
    return {
        router: {
            googleapi: {
                credentials: {
                    client_id: credentials.web.client_id,
                    client_secret: credentials.web.client_secret,
                    redirect_uri: credentials.web.redirect_uris[0]
                }
            }
        }
    };
};
