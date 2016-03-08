var mysqldb = require('./db')('mysql');

function User(user){
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
}

module.exports = User;

User.prototype.save = function(callback){
	var that = this;
	mysqldb.getConnection(function(err, connection){
		var queryString = 'insert userinfo(UserName, UserPassword, UserEmail) values("' + that.name + '", "' + that.password +'", "' + that.email + '")';
		connection.query(queryString, function(err, result){
			if(result){
				result = {
					status: 200,
					msg: 'success'
				}

				callback(null, result);
			}

			connection.release();
		});

	});
};

User.get = function(name, callback){
	mysqldb.getConnection(function(err, connection){
		connection.query('select count(*) from userinfo where UserName = "' + name + '"', function(err, result){
			if(err){
				connection.release();
				return callback(err);
			}

			if(result == 1){
				callback(null, result);
			}else{
				callback(null, null);
			}
		});
	});
}

