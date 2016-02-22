module.exports = function(app, express){
    var path = require('path');

    // view engine setup
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'hbs')
};