const express = require("express"),
	  router=express.Router(),
	  passport = require("passport");
const Page =require("../models/page");
var   ChildCategory=("../models/childCategory");
var   Plant 		=require("../models/plantModel");
var   Subscribe  	=require("../models/userSubscribed");
var   ContactUs    	=require("../models/contactUs.js");
const User 			=require("../models/admin");
const Validation 	=require("../middleware/userValidation.js");
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('489e3013d53841b789a0bea7e1fefd87');

var parentNav=[];
 Page.find({}).populate("childCategory").exec((err,foundPage)=>{
	 	if(err){
	 		console.log(err);
	 	}else{
	 		parentNav=foundPage;
	 		
	 	}
	 	return parentNav;
	});
 //HOME PAGE DATA..........................
///>>>>>MAIN ROUTE<<<<<<<<<<
router.get("/",function (req,res) {	
	var plantLogo=["/resources/HomePage/viewCategoryLogoA.svg","/resources/HomePage/viewCategoryLogoB.svg","/resources/HomePage/viewCategoryLogoC.svg",
					"/resources/HomePage/viewCategoryLogoD.svg","/resources/HomePage/viewCategoryLogoE.svg","/resources/HomePage/viewCategoryLogoF.svg"];
	newsapi.v2.everything({
	  q: 'plant tips ',	  
	  language: 'en',
	  sortBy: 'Date',
	  pageSize: 3
	}).then(response => {
		//This is the section which will be hitted id datat is fetched form newws api
		if(response){		
		  Page.find({}).populate("childCategory").exec((err,foundPage)=>{
			 	if(err){
			 		req.flash("error","SOMETHING WENT WRONG PLEASE RETRY AFTER SOMETIME");
					res.redirect("back")
			 	}else{			 		
			 		Plant.find({},(err,plantData)=>{
						res.render("userArea/index",{plantLogo:plantLogo,page:foundPage,product:plantData,news:response["articles"]});		
					})		 		
			 	}			 	
			}); 
		    
		  //The code below will occur if there is some problem in fetching news  but we want to show th website
		}else{
			 Page.find({}).populate("childCategory").exec((err,foundPage)=>{
			 	if(err){
			 		req.flash("error","SOMETHING WENT WRONG PLEASE RETRY AFTER SOMETIME");
					res.redirect("back")
			 	}else{			 		
			 		Plant.find({},(err,plantData)=>{
						res.render("userArea/index",{page:foundPage,product:plantData,news:false});		
					})		 		
			 	}		
			});				
			} 
		});	
});
////////////////////////////////////
///>>>>>ALL PRODUCTS SHOW PAGE<<<<<<<<<<
router.get("/allProducts",(req,res)=>{
	Page.find({}).populate("childCategory").exec((err,foundPage)=>{
	 	if(err){
	 		req.flash("error","SOMETHING WENT WRONG PLEASE RETRY AFTER SOMETIME");
			res.redirect("back")
	 	}else{	
		 	Plant.find({},(err,foundPlant)=>{
				if (err){
					req.flash("error","SOMETHING WENT WRONG PLEASE RETRY AFTER SOMETIME");
					res.redirect("back");
				}else{
					res.render("userArea/allProducts",{page:foundPage,plant:foundPlant});
				}
			})		 		 				 		
	 	}		
	});		
})
/////////////////////////////////////
//SUBSCRIBE TO NEWS LETTER
router.post("/subscribe",(req,res)=>{
	Subscribe.findOne({email:req.body.SubEmail},(err,data)=>{
		if(err){
			req.flash("error",err.message);
			res.redirect("back");
		}else if (data){
			req.flash("info","THANKS!! YOUR EMAIL IS ALREADY SUBSCRIBED FOR NEWS");
			return	res.redirect("back");
		}else{			
			Subscribe.create({email:req.body.SubEmail},(err,createdEntry)=>{
				if(err){
					req.flash("error",err.message);
					res.redirect("back");
				}else{
					req.flash("success","SUCCESSFULLY SUBSCRIBED TO NEWSLETTER");
					res.redirect("/");
				}
			})
		}
	})
})
//CONTACT THE PLANTAE TEAM
router.post("/plantae/contactUs",(req,res)=>{
	ContactUs.findOne({email:req.body.contact.email},(err,data)=>{
		if(err){
			req.flash("error",err.message);
			res.redirect("back");
		}else if(data){
			req.flash("info","YOU HAVE ALREADY SUBMIITED A CONTACT REQUEST EARLIER PLEASE WAIT BEFORE SENDING AGAIN..	");
			return	res.redirect("back");
		}else{
			ContactUs.create(req.body.contact,(err,createdEntry)=>{
				req.flash("success","WE WILL TRY TO CONTACT YOU AS SOON AS POSSIBLE");
				res.redirect("/");
			})
		}
	})
})

////HOME PAGE DATA END........................................
///>>>>>CATEGORY PAGES<<<<<<<<<<
router.get("/category/:id",(req,res)=>{
	Page.find({}).populate("childCategory").exec((err,foundPage)=>{
	 	if(err){
	 		req.flash("error","SOMETHING WENT WRONG PLEASE RETRY AFTER SOMETIME");
			res.redirect("back")
	 	}else{		 		
		 	Plant.find({category:req.params.id},(err,foundPlant)=>{
				if (err){
					req.flash("error","SOMETHING WENT WRONG PLEASE RETRY AFTER SOMETIME");
					res.redirect("back");
				}else{
					res.render("userArea/categoryShowPage",{page:foundPage,plant:foundPlant});
				}
			})		 		 				 		
	 	}		
	});		
})
///>>>>>PRODUCT PAGES<<<<<<<<<<
router.get("/product/:id",(req,res)=>{
	Page.find({}).populate("childCategory").exec((err,foundPage)=>{
	 	if(err){
	 		req.flash("error","SOMETHING WENT WRONG PLEASE RETRY AFTER SOMETIME");
			res.redirect("back")
	 	}else{		 		
		 	Plant.findOne({_id:req.params.id}).populate("category").exec((err,foundPlant)=>{		
				res.render("userArea/productShowPage",{page:foundPage,plant:foundPlant});
			})	 		 				 		
	 	}		
	});	
})
/////////////////////////////////////////////////////////
///>>>>>LOGIN<<<<<<<<<<
router.get("/login",(req,res)=>{
	res.render("userArea/loginPage");
});

router.post("/login",passport.authenticate("local",{
	successRedirect: "/",
	failureRedirect: "/login",
	failureFlash:true	
}),(req,res)=>{
	console.log(req.body);
});
//////////////////////////////////////////////////////////////
router.get("/register",(req,res)=>{
	res.render("userArea/signUpUser");
})
router.post("/register",(req,res)=>{
	User.findOne({email:req.body.user.email},(err,foundData)=>{
	if(foundData){
		//email Validation
		req.flash("error","THAT EMAIL ALREADY EXISTS");
		return	res.redirect("back");
	}else{
		User.findOne({phone:req.body.user.phone},(err,foundAnother)=>{
			if(foundAnother){
				//phone no validation
				req.flash("error","PHONE NO ALREADY EXISTS");
				res.redirect("/register");
			}else{
				if(req.body.firstPass===req.body.password){
				//everything after validation is done
					req.body.user.email.toLowerCase();
					req.body.user.firstName.toUpperCase();
					if(req.body.user.lastName){
						req.body.user.lastName.toUpperCase();
					}
					var newUser = new User({});
					newUser=req.body.user;
					newUser.username=req.body.user.email;						
					//adding data into database after serializing it
					User.register(newUser,req.body.password,(err,user)=>{
						if(err){
							console.log(err);
							req.flash("error",err.message);
							return res.redirect("/register");
						}
						req.flash("success","SUCCESSFULLY REGISTERED NEW USER PLEASE LOGIN TO CONTINUE");
						res.redirect("/login")
					})		
				}else{
					req.flash("error","PASSWORD ENTERED DO NOT MATCH");
					res.redirect("back");
				}
			}
		})
	}
})
})
//.................................................................................
//LOgout Route for handling logouts of customer
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","SUCCFESFULLY LOGGED OUT MEET YOU SOON");
    res.redirect("/");
})
//...................................................



function data(){
     Page.find({}).populate("childCategory").exec((err,foundPage)=>{
	 	if(err){
	 		return err;
	 	}else{
	 		return foundPage;
	 		
	 	}	 
	});
 }
//......./......../......
//EXPORTS
module.exports=router;


