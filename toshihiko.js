var T = require('toshihiko');
var mysql = require('./config').config;


var toshihiko = new T.Toshihiko(mysql.database, mysql.username, mysql.password, mysql.options);
toshihiko.TYPE = T.type;

module.exports = toshihiko;