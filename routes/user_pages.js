const express = require("express"),
	  router=express.Router(),
	  passport = require("passport");
const Page =require("../models/page");
var   ChildCategory=("../models/childCategory");
var   Plant 		=require("../models/plantModel");
const User 			=require("../models/admin");
const Validation 	=require("../middleware/userValidation.js");


var parentNav=[];
 Page.find({}).populate("childCategory").exec((err,foundPage)=>{
	 	if(err){
	 		console.log(err);
	 	}else{
	 		parentNav=foundPage;
	 		
	 	}
	 	return parentNav;
	});
///>>>>>MAIN ROUTE<<<<<<<<<<
router.get("/",function (req,res) {
	parentNav.forEach(function(data){		
		data.childCategory.forEach(function(newData){		
		})
	});	 
	res.render("userArea/index",{page:parentNav});	
});
////////////////////////////////////

///>>>>>CATEGORY PAGES<<<<<<<<<<
router.get("/category/:id",(req,res)=>{
	Plant.find({category:req.params.id},(err,foundPlant)=>{
		if (err){
			req.flash("error","SOMETHING WENT WRONG PLEASE RETRY AFTER SOMETIME");
			res.redirect("back");
		}else{
			res.render("userArea/categoryShowPage",{plant:foundPlant});
		}

	})
})
///>>>>>PRODUCT PAGES<<<<<<<<<<
router.get("/product/:id",(req,res)=>{
	Plant.findOne({_id:req.params.id}).populate("category").exec((err,foundPlant)=>{		
		res.render("userArea/productShowPage",{plant:foundPlant});
	})	
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

//ROUTE FOR TO CART PAGE
router.get("/cart",Validation.isLoggedIn,(req,res)=>{
	User.findById(req.user._id,(err,foundUser)=>{
		// var cartData= foundUser.cart;
		res.render("userArea/productCart",{cart:foundUser.cart});	
	})
	
})
//......................
//Add an item to cart route
router.get("/addToCart/:id",Validation.isLoggedIn,(req,res)=>{
	User.findOne(req.user._id,(err,foundUser)=>{
		if(err){
			req.flash("error",err.message);
			return res.redirect("back");
		}else{			
			Plant.findOne({_id:req.params.id},(err,foundPlant)=>{
				if(err){
					req.flash("error",err.message);
					return res.redirect("back");
				}else{
					req.flash("success","SUCCESSFULLY ADDED "+ foundPlant.name +" TO CART");					
					// var listCart=[];
					// foundUser.cart.forEach(function(data){
					// 	listCart.push(data._id);
					// })
					// var checker =foundPlant._id;
					// console.log(typeof checker)
					// for(var i =0 ;i<listCart.length;i++){
					// 	console.log(listCart[i]);
					// }
					//There is a damn bug in the whole system as we can add same item multiple times
					var objectCart ={
						plantId:foundPlant._id,
						plantName:foundPlant.name,
						plantImage:foundPlant.image,
						plantDesc:foundPlant.description,
						price:foundPlant.price,
						quantity:1
					};

						foundUser.cart.push(objectCart);	
						foundUser.save();
						res.redirect("back");
				}
			})		
		}
	})
});
//............................

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



//......./......../......
//EXPORTS
module.exports=router;


