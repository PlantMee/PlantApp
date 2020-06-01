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
			res.render("userArea/userProfile",{user:foundUser});
		}
	})
});
///////////////////////////////
//personal info edit page
router.get("/:id/edit/personal",Validation.isLoggedIn,(req,res)=>{
	res.send("THIS IS THE PAGE EHERE USDER WILL ABLE TO UPDATE HIS DATA")
});


///////////////////////////////

module.exports=router;