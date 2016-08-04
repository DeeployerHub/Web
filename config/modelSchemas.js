var fs       = require('fs');
var path     = require('path');
var mongoose = require('mongoose');
var Promise  = require('promise');

module.exports.bootstrap = function () {
    'use strict';


    var schemasObj = [];
    var schemasTmp = fs.readdirSync('./models/schemas');

    // fetch the schema objects
    schemasTmp.forEach(function (schema) {
        if (path.extname(schema) === '.js') {
            schemasObj.push(require('../models/schemas/' + schema));
        }
    });

    mongoose.Promise = Promise;
    mongoose.connect(
        'mongodb://' + getEnvConfig('mongoDb').host + '/' + getEnvConfig('mongoDb').dbName
    );

    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

    // convert the schema objects to model
    var schemaObject = mongoose.Schema;
    var schemas      = {};

    schemasObj.forEach(function (schema) {
        schemas[schema.alias] = mongoose.model(
            schema.collectionName,
            new schemaObject(schema.schema, schema.conditions || {})
        );
    });

    return schemas;
};
