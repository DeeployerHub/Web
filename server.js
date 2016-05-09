require('./bootstrap');

passport = require('passport');
var redis = require('socket.io-redis');

express  = require('express');
app = express();
server = require('http').Server(app);
io = require('socket.io')(server,  {'transports': ['websocket']});
io.adapter(redis({
    host: getEnvConfig('redis').host,
    port: getEnvConfig('redis').port
}));

server.listen(expressPort, function () {
    'use strict';

    console.log('[LISTEN] PID: "' + process.pid + '" PORT: "' + expressPort + '"');
});

require('./config/env.js')(app, express, io);
require('./config/routes.js');
