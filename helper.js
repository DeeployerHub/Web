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

getRequire = function(dir, param) {
    param = param.split('.');
    return require('./' + dir + '/' + param[0] + '.js')[param[1]];
};

getMiddleware = function(middleware) {
    return getRequire('middleware', middleware);
};

getRepos = function(repository) {
    return getRequire('repositories', middleware);
}

getModel = function(repository) {
    return getRequire('models', middleware);
}
