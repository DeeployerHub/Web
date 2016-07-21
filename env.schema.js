module.exports = {
    cookie: {
        key: 'dskey',
        secret: 'redis-secret'
    },
    app: {
        expressPort: 7000,
        expressEnv: 'dev',
        socketPath: 'wss://dev.eloyt.com',
        request: {
            protocol: 'https://',
            domains: {
                main: 'dev.eloyt.com'
            }
        }
    },
    redis: {
        host: '192.168.99.100',
        port: 6379,
        ttl: 2600000
    },
    mongoDb: {
        dbName: 'db_dev',
        host: '192.168.99.100'
    },
    tokens: {
        google: {
            oauth: {
                clientId: 'ask manager for token code',
                clientSecret: 'ask manager for token code'
            }
        },
        aws: {
            s3: {
                accessKeyId: 'ask manager for token code',
                secretAccessKey: 'ask manager for token code',
                regin: 'us-west-2',
                bucket: 'eloytdev'
            }
        }
    },
    googleMap: {
        key: 'ask manager for token code'
    }
};
