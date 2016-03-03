globalObject = {
    domain: require('./config/domain.js'),
    auth: require('./config/auth.js')
};

require('./helper.js');

expressPort = getEnv('EXPRESS_PORT', 7000);
expressEnv = getEnv('EXPRESS_ENV', 'dev');
