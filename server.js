require('./bootstrap');
passport = require('passport');

passport = require('passport');

express  = require('express');
app = express();
server = require('http').Server(app);
socketIo = require('socket.io')(server).of('/deeployer');

require('./config/env.js')(app, express);
require('./config/routes.js');

socketIo.on('connection', function(socket) {
    'use strict';

    console.log('connect', socket.id);
    socket.on('disconnect', function() {
        console.log('disconnect', socket.id);
    });
});

socketIo.use(function(socket, next){
    'use strict';

    if (socket.request.headers.cookie) {
        return next();
    }

    next(new Error('Authentication error'));
});
//
// socketIo.on('connection', function (socket) {
//     'use strict';
//
//     console.log('connect', socket.id);
//
//     socket.emit("tweet", {user: "nodesource", text: "Hello, world!"});
// });
//
// socketIo.on('disconnection', function (socket) {
//     'use strict';
//
//     console.log('disconnect', socket.id);
// });

server.listen(expressPort, function () {
    'use strict';

    console.log('[LISTEN] PID: "' + process.pid + '" PORT: "' + expressPort + '"');
});
