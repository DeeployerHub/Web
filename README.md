## preparation
* you need to install the essential dependencies
```
sudo npm install gulp -g
sudo npm install bower -g
```

* and then setup the environment
```
# this script runs the bower install and gulp
npm run-script setup
```

## gulp modules
* compile the assets from ./assets directory to public directory
```
gulp
# watch on assets
gulp assets:watch
```
