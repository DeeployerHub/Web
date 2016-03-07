globalObject = {
    domain: require('./config/domain.js'),
    auth: require('./config/auth.js'),
    modelSchemas: {}
};

require('./helpers.js');

var modelSchemas = require('./config/modelSchemas.js');
globalObject.modelSchemas = modelSchemas.bootstrap();

expressPort = getEnv('EXPRESS_PORT', 7000);
expressEnv = getEnv('EXPRESS_ENV', 'dev');
