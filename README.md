[![Build Status](https://travis-ci.org/WAAC/d-web.svg?branch=master)](https://travis-ci.org/WAAC/d-web)

## preparation
* you need to install the essential dependencies
```
sudo make -f Makefile
```

* and then setup the environment
```
# this script runs the bower install and gulp
sudo npm run-script setup
```

* quick run
```
# normal run
sudo npm run-script dev-run
# supervisor run - incase you want to reset the app on each change
sudo npm run-script dev-run-supervisor
```

## gulp modules
* compile the assets from ./assets directory to public directory
```
gulp
# watch on assets
gulp assets:watch
```
