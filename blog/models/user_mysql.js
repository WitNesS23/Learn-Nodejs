var mysqldb = require('./db')('mysql');

function User(user){
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
}

module.exports = User;

User.prototype.save = function(callback){
	mysqldb.getConnection(function(err, connection){
		var that = this;
		connection.query('insert UserInfo(UserName, UserPassword, UserEmail) values(' + that.name + ', ' + that.password +', ' + that.email + ')', function(err, result){
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
		connection.query('select count(*) from UserInfo where UserName = "' + name + '"', function(err, result){
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

