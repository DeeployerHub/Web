[![Build Status](https://travis-ci.org/WAAC/d-web.svg?branch=master)](https://travis-ci.org/WAAC/d-web)

## preparation
* you need to install the essential dependencies
```
sudo npm install gulp -g
sudo npm install bower -g
```

* and then setup the environment
```
# this script runs the bower install and gulp
sudo npm run-script setup
```

* quick run
```
sudo npm run-script quick-run
```

## gulp modules
* compile the assets from ./assets directory to public directory
```
gulp
# watch on assets
gulp assets:watch
```
