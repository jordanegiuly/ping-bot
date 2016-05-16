'use strict';

const config = require('./config')();
const app = require('./app')(config);

app.listen(app.get('port'));
