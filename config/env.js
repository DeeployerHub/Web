module.exports = function (app, express) {
    'use strict';

    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var util = require('util');

    // session on redis
    var redis = require("redis");
    var session = require('express-session');
    var redisStore = require('connect-redis')(session);
    var client = redis.createClient();

    app.use(session({
        secret: 'redis-secret',
        // create new redis store.
        store: new redisStore({
            host: getEnvConfig('redis').host,
            port: getEnvConfig('redis').port,
            client: client,
            ttl: getEnvConfig('redis').ttl
        }),
        proxy: true,
        resave: true,
        saveUninitialized: true
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
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '../public')));

    require('./auth/google.js')();

    app.use(passport.initialize());
    app.use(passport.session());
};