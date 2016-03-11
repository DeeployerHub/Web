express = require('express');
app = express();
passport = require('passport');

require('./config/env.js')(app, express);
require('./config/routes.js');

app.listen(expressPort, function () {
    console.log('App listening on port ' + expressPort + '');
});
