var T = require('toshihiko');
var mysql = require('./config').mysql;


var toshihiko = new T.Toshihiko(mysql.database, mysql.username, mysql.password, mysql.options);
toshihiko.TYPE = T.Type;

module.exports = toshihiko;