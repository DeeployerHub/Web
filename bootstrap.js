globalObject = {
    countries: require('./config/countries.js'),
    modelSchemas: {},
    envConfig: require('./env.js'),
    events: {}
};

require('./helpers.js');

var modelSchemas = require('./config/modelSchemas.js');
globalObject.modelSchemas = modelSchemas.bootstrap();

var fs = require('fs');
var path = require('path');
var eventDir = fs.readdirSync('./models/schemas');

eventDir.forEach(function (eventFile) {
    if (path.extname(eventFile) === '.js') {
        require('./events/' + eventFile);
    }
})

expressPort = getEnvConfig('app').expressPort;
expressEnv = getEnvConfig('app').expressEnv;
