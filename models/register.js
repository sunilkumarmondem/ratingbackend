var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var registerschema = new Schema({
	firstname:{type:String},
	lastname:{type:String},
	email:{type:String},
	password:{type:String},
	javascript:{type:String},
	nodejs:{type:String}

});

var Register = mongoose.model('registerusers', registerschema);
module.exports = Register;

module.exports.adduser = function(newuser,callback){
	bcrypt.genSalt(10,function(err,salt){
		if(err) throw err;
		bcrypt.hash(newuser.password,salt,function(err,hash){
			newuser.password=hash;
			newuser.save(callback);
		})
	})

};

module.exports.comparepassword=function(password,hashpassword,callback){
	bcrypt.compare(password,hashpassword,function(err,isMatch){
		
		callback(null,isMatch);
	})
};

