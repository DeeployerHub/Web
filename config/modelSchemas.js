module.exports.bootstrap = function () {
    'use strict';

    var fs = require('fs');
    var path = require('path');

    var schemasObj = [];
    var schemasTmp = fs.readdirSync('./models/schemas');

    // fetch the schema objects
    for (var i in schemasTmp) {
        if (path.extname(schemasTmp[i]) === '.js') {
            schemasObj.push(require('../models/schemas/' + schemasTmp[i]));
        }
    }

    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/db_' + getEnv('EXPRESS_ENV', 'dev'));


    // convert the schema objects to model
    var schemas = {};
    for (var i in schemasObj) {
        schemas[schemasObj[i].collectionName] = mongoose.model(
            schemasObj[i].collectionName,
            schemasObj[i].schema
        );
    }

    return schemas;
};
