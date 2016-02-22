expressPort = process.env.EXPRESS_PORT || 7000;

express = require('express');
app = express();

require('./config/env.js')(app, express);
require('./config/routes.js');

app.listen(expressPort, function () {
    console.log('App listening on port ' + expressPort + '');
});
