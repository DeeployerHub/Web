app.use(function (req, res, next) {
    'use strict';

    app.locals.request         = req;
    app.locals.env             = expressEnv;
    app.locals.socketPath      = getEnvConfig('app').socketPath;
    app.locals.googleMapApiKey = getEnvConfig('googleMap').key;

    next();
});

app.use('/', require('../routes/root')());
app.use('/profile', require('../routes/profile')());
app.use('/account', require('../routes/account')());
app.use('/console', require('../routes/console')());
app.use('/notifications', require('../routes/notifications')());
app.use('/posts', require('../routes/posts')());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    'use strict';

    var err    = new Error('Page not found or under construction');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        'use strict';

        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktrace leaked to user
app.use(function (err, req, res, next) {
    'use strict';

    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
