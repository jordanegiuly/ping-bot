module.exports = (libs, config) => {
    const router = require('express').Router();
    const googlecalendar = require('./googlecalendar')(libs.googleapi, config.googleapi);

    router.get('/', (req, res) => {
        res.send('Hello world!');
    });
    router.use('/googlecalendar', googlecalendar);
    return router;
};

/*
Routes

- ping
    - POST
    - target login
    - actions:
       - get google login
       - connect to calendar
       - authorization ?
          - yes: return boolean
          - no: return not authorized

Libs:
- Google
   - authorize OK
   - store authorization
   - ping calendar ~
- Slack
   - get google login
   - send google link
   - send boolean
*/
