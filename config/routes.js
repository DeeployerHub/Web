app.use(function(req, res, next) {
    'use strict';

    app.locals.request = req;
    app.locals.env = expressEnv;

    next();
});

app.use('/', require('../routes/root.js')());
app.use('/profile', require('../routes/profile.js')());
app.use('/account', require('../routes/account.js')());
app.use('/console', require('../routes/console.js')());
app.use('/notifications', require('../routes/notifications.js')());
app.use('/posts', require('../routes/posts.js')());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    'use strict';

    var err = new Error('Page not found or under construction');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        'use strict';

        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    'use strict';

    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
