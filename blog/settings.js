module.exports = function(dbType) {
    if(dbType == 'mongodb'){
        return {
            cookieSecret: 'myblog',
            db: 'db',
            host: 'localhost',
            port: 27017
        };
    }else if(dbType == 'mysql'){
    	return {
            cookieSecret: 'TomandJerry',
    		host: 'localhost',
    		user: 'root',
    		password: 'a12345',
    		database: 'blog',
            port: 3306
    	};
    }
}
