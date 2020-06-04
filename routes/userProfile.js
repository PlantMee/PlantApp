const express = require("express"),
	  router=express.Router(),
	  passport = require("passport");
const Page =require("../models/page");
var   ChildCategory=("../models/childCategory");
var   Plant 		=require("../models/plantModel");
const User 			=require("../models/admin");
const Validation 	=require("../middleware/userValidation.js");


//=====USER PROFILE ROUTE======
router.get("/:id/profile",Validation.isLoggedIn,(req,res)=>{
	User.findOne(req.user._id,(err,foundUser)=>{
		if(err){
			req.flash("error",err.message);
			return res.redirect("back");
		}else{		
			res.render("userArea/userProfile",{user:foundUser,cart:foundUser.cart});
		}
	})
});
///////////////////////////////
//personal info edit page
router.get("/:id/edit/personal",Validation.isLoggedIn,(req,res)=>{
	res.send(req.body);
});
//....................................................................
//user address data route
router.get("/:id/edit/address",Validation.isLoggedIn,(req,res)=>{
	res.send("THIS IS USER ADDRESS ROUTE WHICH WILL BE HERE");
})
//....................................................................

//user password data can be changed using here
router.get("/:id/edit/password",Validation.isLoggedIn,(req,res)=>{
	res.send("THIS IS THE PASWORD EDI PAGE");
})
//....................................................................

///////////////////////////////
module.exports=router;