const express = require("express"),
	  router=express.Router(),
	  passport = require("passport");
const Page =require("../models/page");
var   ChildCategory=("../models/childCategory");
var   Plant 		=require("../models/plantModel");
const User 			=require("../models/admin");
const Validation 	=require("../middleware/userValidation.js");
//.............................................................................................

//ROUTE FOR TO CART PAGE
router.get("/cart",Validation.isLoggedIn,(req,res)=>{
	Page.find({}).populate("childCategory").exec((err,foundPage)=>{
	 	if(err){
	 		req.flash("error","SOMETHING WENT WRONG PLEASE RETRY AFTER SOMETIME");
			res.redirect("back")
	 	}else{	
			User.findById(req.user._id,(err,foundUser)=>{
				// var cartData= foundUser.cart;
				res.render("userArea/productCart",{page:foundPage,cart:foundUser.cart});	
			}) 				 		
	 	}		
	});	
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

router.get("/cart/:id/remove",(req,res)=>{
	
})




///..........END OF ROUTES.......................................................................
module.exports =router;