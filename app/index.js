'use strict';

const express = require('express');
const bodyParser = require('body-parser');

module.exports = config => {
    const app = express();
    const libs = require('./libs')();
    const router = require('./router')(libs, config.router);
    app.set('port', process.env.PORT || '3000');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(router);
    return app;
};
