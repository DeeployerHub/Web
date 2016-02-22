app.use('/', require('../routes/root/routes.js')());
app.use('/profile', require('../routes/profile/routes.js')());
