const express = require('express');
const bodyParser = require('body-parser');

module.exports = () => {
    const app = express();
    const router = require('./router')();
    app.set('port', process.env.PORT || '3000');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(router);
    return app;
};
