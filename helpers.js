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

getMiddleware = function (middleware) {
    'use strict';

    middleware = middleware.split('.');
    return require('./middleware/' + middleware[0] + '.js')[middleware[1]];
};

getRepos = function (repository) {
    'use strict';

    repository = repository.split('.');
    return require('./repository/' + repository[0] + '.js')[repository[1]];
};
