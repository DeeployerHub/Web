globalObject = {
    domain: require('./config/domain.js'),
    auth: require('./config/auth.js')
};

getController = function(name) {
    return require('./controllers/' + name);
};

getConfig = function(config) {
    return globalObject[config];
};

getEnv = function(env, defaultValue) {
    return process.env[env] || defaultValue;
};

getProtocol = function() {
    return 'http://';
};

getDomain = function(domain) {
    return getProtocol() +
        getConfig('domain')[getEnv('EXPRESS_ENV', 'dev')][domain || 'main'];
};

getMiddleware = function(middleware) {
    middleware = middleware.split('.');
    return require('./middleware/' + middleware[0] + '.js')[middleware[1]];
};

getRepos = function(repository) {
    repository = repository.split('.');
    return require('./repository/' + repository[0] + '.js')[repository[1]];
}

expressPort = getEnv('EXPRESS_PORT', 7000);
expressEnv = getEnv('EXPRESS_ENV', 'dev');
