var bundle = {
    chai: require('chai')
};

require('./unit-tests')(bundle).boot();
require('./integration-tests')(bundle).boot();