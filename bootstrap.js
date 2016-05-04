globalObject = {
    countries: require('./config/countries.js'),
    modelSchemas: {},
    envConfig: require('./env.js'),
    events: {}
};

require('./helpers.js');

var modelSchemas = require('./config/modelSchemas.js');
globalObject.modelSchemas = modelSchemas.bootstrap();

expressPort = getEnvConfig('app').expressPort;
expressEnv = getEnvConfig('app').expressEnv;
