express = require('express');
app = express();
passport = require('passport');

require('./config/env.js')(app, express);
require('./config/routes.js');

app.listen(expressPort, function () {
    'use strict';

    console.log(`{LISTEN] PID: "${process.pid}" PORT: "${expressPort}"`);
});
