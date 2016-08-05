getConfig = function (config) {
    'use strict';

    return globalObject[config];
};

getEnvConfig = function (config) {
    'use strict';

    return globalObject.envConfig[config];
};

getController = function (name) {
    'use strict';

    return require('./controllers/' + name);
};

getEnv = function (env, defaultValue) {
    'use strict';

    return process.env[env] || defaultValue;
};

getProtocol = function () {
    'use strict';

    return getEnvConfig('app').request.protocol;
};

getDomain = function (domain) {
    'use strict';

    return getProtocol() +
        getEnvConfig('app').request.domains[domain || 'main'];
};

getMiddleware = function (middleware) {
    'use strict';

    return require('./middleware/' + middleware);
};

getRepos = function (repository) {
    'use strict';

    return require('./repositories/' + repository);
};

getModelSchema = function (model) {
    'use strict';

    if (!globalObject.modelSchemas[model]) {
        throw new Error('model "' + model + '" has not staged yet');
    }

    return globalObject.modelSchemas[model];
};

getModel = function (model) {
    'use strict';

    return require('./models/' + model);
};

getSocketActions = function (io) {
    'use strict';

    return require('./sockets/actions')(io);
};

getLib = function (lib) {
    'use strict';

    return require('./libs/' + lib);
};

errorPageRender = function (res, code, message) {
    'use strict';

    var err    = new Error(message);
    err.status = code;
    res.status(err.status);
    res.render('error', {
        message: message,
        error: err
    });
};

ucfirst = function (string) {
    'use strict';

    return string[0].toUpperCase() + string.slice(1);
};
