'use strict';

/* DB */
var mongoose = require('mongoose');
require('../api/models/Users');
var Config = require('./config.js').get(process.env.NODE_ENV || 'local');

console.log('config ', Config);
var options = {
    user: Config.DATABASE.username,
    pass: Config.DATABASE.password
};

mongoose.connect(Config.DATABASE.host + Config.DATABASE.dbname, options);

var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection failed"));
db.once('open', function () {
    console.log("Database conencted successfully and project Started!");
});
mongoose.set('debug', false);
/* end DB */