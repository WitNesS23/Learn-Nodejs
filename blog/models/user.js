var mongodb = require('./db');

function User(user){
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
}

module.exports = User;

// save the user info
User.prototype.save = function(callback){
	// the thing will be saved into the db
	var user = {
		name: this.name,
		password: this.password,
		email: this.email
	};

	// open the db connection
	mongodb.open(function(err, db){
		if(err){
			return callback(err); // wrong, return the err info
		}

		// read the collections of users
		db.collection('users', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err); // wrong, return the err info
			}

			// add the user info to the collections
			collection.insert(user, {
				safe: true
			}, function(err, user){
				if(err){
					mongodb.close();
					return callback(err); // wrong, return the err info
				}

				mongodb.close();
				callback(null, user[0]);
			})
		})
	});
};

// read the info of user
User.get = function(name, callback){
	// open the db
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}

		db.collection('users', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.findOne({
				name: name
			}, function(err, user){
				if(err){
					mongodb.close();
					return callback(err);
				}

				mongodb.close();
				callback(null, user);
			});
		})
	});
};