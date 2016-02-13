var expressPort = process.env.EXPRESS_PORT || 7000;

var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(expressPort, function () {
    console.log('Example app listening on port ' + expressPort + '!');
});