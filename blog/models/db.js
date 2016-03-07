var settings = require('../settings');

module.exports = function(dbType) {
    if (dbType == 'mongodb') {
        var settings_mongo = settings('mongodb'),
            Db = require('mongodb').Db,
            Connection = require('mongodb').Connection,
            Server = require('mongodb').Server;

        return new Db(settings_mongo.db, new Server(settings_mongo.host, settings_mongo.port), { safe: true });
    }else if(dbType == 'mysql'){
    	var settings_mysql = settings('mysql');
    	var mysql = require('mysql');
    	var pool = mysql.createPool(settings_mysql);
    	return pool;
    }
};
