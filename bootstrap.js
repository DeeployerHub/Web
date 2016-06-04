globalObject = {
    countries: require('./config/countries'),
    notifications: require('./config/notifications'),
    modelSchemas: {},
    envConfig: require('./env.js'),
    events: {}
};

require('./helpers.js');

var modelSchemas          = require('./config/modelSchemas.js');
globalObject.modelSchemas = modelSchemas.bootstrap();

expressPort = getEnvConfig('app').expressPort;
expressEnv  = getEnvConfig('app').expressEnv;
