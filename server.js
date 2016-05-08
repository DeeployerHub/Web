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
io.path('deeployer');

server.listen(expressPort, function () {
    'use strict';

    console.log('[LISTEN] PID: "' + process.pid + '" PORT: "' + expressPort + '"');
});

io.on('connection', function(socket) {
    'use strict';

    console.log('connect', socket.id, 'pid', process.pid);
    socket.on('disconnect', function() {
        console.log('disconnect', socket.id, 'pid', process.pid);
    });
});

io.use(function(socket, next){
    'use strict';

    if (socket.request.headers.cookie) {
        return next(null, true);
    }

    next(new Error('Authentication error'), false);
});

require('./config/env.js')(app, express, io);
require('./config/routes.js');
