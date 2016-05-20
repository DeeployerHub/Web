require('./bootstrap');

passport = require('passport');
var redis = require('socket.io-redis');
var fs = require('fs');

express  = require('express');
app = express();

var credentials = {
    key: fs.readFileSync('./sslcert/' + getEnvConfig('app').expressEnv + '/server.key', 'utf8'),
    cert: fs.readFileSync('./sslcert/' + getEnvConfig('app').expressEnv + '/server.crt', 'utf8')
};

server = require('https').Server(credentials, app);
io = require('socket.io')(server,  {'transports': ['websocket']});
io.adapter(redis({
    host: getEnvConfig('redis').host,
    port: getEnvConfig('redis').port
}));

server.listen(443, function () {
    'use strict';

    console.log('[LISTEN] PID: "' + process.pid + '" PORT: "' + expressPort + '"');
});

require('./config/env.js')(app, express, io);
require('./config/routes.js');
require('./sockets')(io);
