const express = require("express"),
	  router=express.Router(),
	  passport = require("passport");
const Page =require("../models/page");
var   ChildCategory=("../models/childCategory");
var   userCategory=("../models/userCategory");
var   Plant 		=require("../models/plantModel");
const User 			=require("../models/admin");
const Validation 	=require("../middleware/userValidation.js");
const states		=require("../config/extras");
const Middleware	=require("../middleware/index");

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'deepjha98',
  api_key:"696316222696763"||process.env.CLOUDINARY_API_KEY, 
  api_secret:"2EZYqtpnBHlz80XeBCdxJnVPIjE"||process.env.CLOUDINARY_API_SECRET
});
///////////////////////////////


//=====USER PROFILE ROUTE======
router.get("/:id/profile",Validation.isLoggedIn,(req,res)=>{ 	
 	Page.find({}).populate("childCategory").exec((err,foundPage)=>{
	 	if(err){
	 		req.flash("error","SOMETHING WENT WRONG PLEASE RETRY AFTER SOMETIME");
			res.redirect("back")
	 	}else{	
		 	User.findOne(req.user._id,(err,foundUser)=>{
				if(err){
					req.flash("error",err.message);
					return res.redirect("back");
				}else{		
					res.render("userArea/userProfile",{page:foundPage,states:states,user:foundUser,cart:foundUser.cart});
				}
			})	 		 				 		
	 	}		
	});	 	
});
///////////////////////////////
//personal info edit page
router.put("/:id/edit/personal",Validation.isLoggedIn,Middleware.upload.single('profilePic'),(req,res)=>{
	 User.findById(req.params.id, async function(err, user){
        if(err){
        	console.log("1")
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try { 
              	  var result;
	              	  if(user.imageId && user.profilePic ){
	              	  	await cloudinary.v2.uploader.destroy(user.imageId);
	              	  	result = await cloudinary.v2.uploader.upload(req.file.path);
		                user.imageId = result.public_id;
		                user.profilePic = result.secure_url;
	              	  }else{             
		                var result = await cloudinary.v2.uploader.upload(req.file.path);
		                user.imageId = result.public_id;
		                user.profilePic = result.secure_url;
		              }
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }             
            if(req.body.phone!=user.phone){
            	User.findOne({phone:req.body.phone},(err,foundSomeOne)=>{
            		if(foundSomeOne){
            			console.log("3")
            			req.flash("error","USER ALREADY EXISTES WITH THE SAME PHONE NUMBER")
            			res.redirect("back");
            		}else{
            			console.log("4") 
        			  	user.firstName=req.body.firstName;
			            user.lastName=req.body.lastName;           			
		            	user.phone	=req.body.phone;
			            user.save();
			            req.flash("success","Successfully Updated the user!");
			            res.redirect("back");	
            		}
            	})
            }else{
            	console.log("5")
            	user.firstName=req.body.firstName;
          		user.lastName=req.body.lastName;
            	user.phone	=req.body.phone;
	            user.save();
	            req.flash("success","Successfully Updated the user!");
	            res.redirect("back");	
            }            
        }
    });
});
//....................................................................
//user address data route
router.put("/:id/edit/address",Validation.isLoggedIn,(req,res)=>{
	User.findByIdAndUpdate(req.params.id,{address:req.body.address},(err,user)=>{
		if(err){
			req.flash("error",err.message);
			res.redirect("back");
		}else{			
            req.flash("success","Successfully Updated the user!");
            res.redirect("back");	
		}
	})
})
//....................................................................

//user password data can be changed using here
router.put("/:id/edit/password",Validation.isLoggedIn,(req,res)=>{
	if(req.body.firstPass===req.body.password){
		User.findById(req.params.id,(err,user)=>{
			if(err){
				req.flash("error",err.message);
				res.redirect("back");
			}else{
					//Change password
				user.changePassword(req.body.oldPassword, req.body.password, (err)=>{
					if(err){
						req.flash("error",err.message);
						res.redirect("back");
					}else{
						req.flash("success","Successfully changedthe password");
						res.redirect("back");
					}
				})		
			}
		})						
	}else{
		req.flash("error","PASSWORD ENTERED DO NOT MATCH");
		res.redirect("back");
	}
})
//....................................................................

///////////////////////////////
module.exports=router;