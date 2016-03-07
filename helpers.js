getController = function (name) {
    'use strict';

    return require('./controllers/' + name);
};

getConfig = function (config) {
    'use strict';

    return globalObject[config];
};

getEnv = function (env, defaultValue) {
    'use strict';

    return process.env[env] || defaultValue;
};

getProtocol = function () {
    'use strict';

    return 'http://';
};

getDomain = function (domain) {
    'use strict';

    return getProtocol() +
        getConfig('domain')[getEnv('EXPRESS_ENV', 'dev')][domain || 'main'];
};

getLib = function (name, lib) {
    'use strict';

    lib = lib.split('.');
    return require('./' + name + '/' + lib[0] + '.js')[lib[1]];
};

getMiddleware = function (middleware) {
    'use strict';

    return getLib('middleware', middleware);
};

getRepos = function (repository) {
    'use strict';

    return require('./repositories/' + repository + '.js');
};

getModelSchema = function (model) {
    'use strict';

    if (!globalObject.modelSchemas[model]) {
        throw new Exception('model "' + model + '" has not staged yet');
    }

    return globalObject.modelSchemas[model];
};

getModel = function (model) {
    'use strict';

    return require('./models/' + model + '.js');
};
