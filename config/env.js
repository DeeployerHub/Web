module.exports = function(app, express){
    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');


    // session on redis
    var redis   = require("redis");
    var session = require('express-session');
    var redisStore = require('connect-redis')(session);
    var client  = redis.createClient();

    app.use(session({
        secret: 'redis-secret',
        // create new redis store.
        store: new redisStore({ 
            host: '127.0.0.1', 
            port: 6379, 
            client: client,
            ttl :  2600000
        }),
        saveUninitialized: false,
        resave: false
    }));

    var swig = require('swig');
    swig.setDefaults({
        cache: false
    });
    app.engine('html', swig.renderFile);
    // view engine setup
    app.set('view engine', 'html');
    app.set('views', path.join(__dirname, '../views'));
    app.set('view cache', false);


    app.use(favicon(path.join(__dirname, '../public/assets/images/favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '../public')));
};