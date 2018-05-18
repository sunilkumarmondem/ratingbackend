var express = require('express');
var router =express.Router();
var Register = require('../models/register');
var config = require('../config');
var jwt = require('jsonwebtoken');
var jwtcheck = require('../middlewares/checkjwt');



router.post('/register',function(req,res){
	let newuser = new Register({
		firstname:req.body.firstname,
		lastname:req.body.lastname,
		email:req.body.email,
		password:req.body.password,
		javascript:req.body.javascript,
		nodejs:req.body.nodejs
	});
	Register.findOne({email:req.body.email},function(err,user){
		if(user){
			res.json({success:false , msg: 'Account already exists'});

		}
		else{
			Register.adduser(newuser,function(err,user){
				if(err){
					res.json({success:false , msg: 'Failed to register user'});
				}
				else{
					
					var token = jwt.sign({user:user},config.secret,{expiresIn:'7d'});
					
					res.json({success:true , msg: 'user registered successfully',token:token});
				}
			})
		}
	})
});



router.post('/login',function(req,res){
	Register.findOne({email:req.body.email},function(err,user){
		if(err) throw err;
		if(!user){
			res.json({success:false , msg: 'user not found'});
		}
		else if(user){
			Register.comparepassword(req.body.password,user.password,function(err,isMatch){
				if(err) throw err;
				if(!isMatch){

					res.json({success:false , msg: 'password is wrong'});
				}
				else {
					var token = jwt.sign({user:user},config.secret,{expiresIn:'7d'});
					res.json({success:true,msg:'you are logged in ',token:token,user:user});
				}
			})
		}
	})

});

router.get('/users',function(req,res){
	Register.find({}).then(function(data){
		res.send(data);
	})
});

router.get('/users/:id',function(req,res){
	Register.findById({_id:req.params.id}).then(function(data){
		res.send(data);
	})
})

router.get('/profile',jwtcheck,function(req,res){
	Register.findOne({_id:req.decoded.user._id},function(err,user){
		res.json({success:true,user:user,msg:'successful'});
	})
});

router.post('/profile',jwtcheck,function(req,res,next){
	Register.findOne({_id:req.decoded.user._id},function(err,user){
		
		
		  if(req.body.firstname) {user.firstname= req.body.firstname};
		 if(req.body.lastname) {user.lastname= req.body.lastname};
		 if(req.body.email) {user.email= req.body.email};
		 if(req.body.password) {user.password= req.body.password};
		 if(req.body.javascript) {user.javascript= req.body.javascript};
		 if(req.body.nodejs) {user.nodejs= req.body.nodejs};
		
		user.save();
		res.json({
			success:true,user:user,msg:'successfully edited your profile'
		});

	});
});



module.exports = router;




