const express = require("express"),
	  router=express.Router(),
	  passport = require("passport");
const Page =require("../models/page");
var   ChildCategory=("../models/childCategory");
var   Plant 		=require("../models/plantModel");
var   Subscribe  	=require("../models/userSubscribed");
var   ContactUs    	=require("../models/contactUs.js");
const User 			=require("../models/admin");
var   Reviews		=require("../models/reviews");
const Validation 	=require("../middleware/userValidation.js");
//..............................................................................................

//New review channel to add review
router.post("/product/:id/review",Validation.isLoggedIn,(req,res)=>{
	//lookup plant using ID
   Plant.findById(req.params.id, (err, plant)=>{
       if(err){
           console.log(err);
           res.redirect("/plants");
       } else {
        Reviews.create(req.body.review, (err, review)=>{
           if(err){
               console.log(err);
           } else {
               //add username and id to review
               review.author.id = req.user._id;               
               review.username = req.user.firstName;
               //save review
               review.save();
               plant.reviews.push(review);
               plant.save();              
               req.flash('success', 'Thanks for your valuable review!!');
               res.redirect('/product/'+req.params.id);
           }
        });
       }
   });
});
//>>NEW review END.................

//Edit review channel to add review
router.put("/:id",Validation.isLoggedIn,(req,res)=>{

});
//>>EDIT review END.................

//Delete review channel to add review
router.delete("/:id",Validation.isLoggedIn,(req,res)=>{

});
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


///..........END OF ROUTES.......................................................................
module.exports =router;