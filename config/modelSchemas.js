module.exports.bootstrap = function () {
    'use strict';

    var fs = require('fs');
    var path = require('path');

    var schemasObj = [];
    var schemasTmp = fs.readdirSync('./models/schemas');

    // fetch the schema objects
    schemasTmp.forEach(function (schema) {
        if (path.extname(schema) === '.js') {
            schemasObj.push(require('../models/schemas/' + schema));
        }
    });

    var mongoose = require('mongoose');
    mongoose.connect(
        'mongodb://' + getEnvConfig('mongoDb').host + '/' + getEnvConfig('mongoDb').dbName
    );

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    // convert the schema objects to model
    var schemas = {};
    schemasObj.forEach(function (schema) {
        schemas[schema.collectionName] = mongoose.model(
            schema.collectionName,
            schema.schema
        );
    });

    return schemas;
};
