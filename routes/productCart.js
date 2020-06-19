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
router.post("/addToCart/:id",Validation.isLoggedIn,(req,res)=>{
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
					var productQuantity;
					if(req.body.quantity){
						productQuantity=req.body.quantity;
						console.log(1)
					}else{
						console.log(2)
						productQuantity=1;
					}
					console.log(req.body);
					var objectCart ={
						plantId:foundPlant._id,
						plantName:foundPlant.name,
						plantImage:foundPlant.image,
						plantDesc:foundPlant.description,
						price:foundPlant.price,
						quantity:productQuantity
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

router.get("/cart/:id/remove",Validation.isLoggedIn,(req,res)=>{
	Plant.findOne({_id:req.params.id},(err,foundPlant)=>{
		if(err){
			req.flash("error",err.message);
			return res.redirect("back");
		}else{
			User.updateOne({'_id':req.user._id},
		        { $pull: { 'cart': { plantId: req.params.id }}},
		        function(err,result){        	
		   		}
		    )   
		    req.flash("success","REMOVED "+foundPlant.name+" SUCCESSFULLY FROM YOUR CART") 
		    res.redirect("back");
		}
	})	
})
///..........END OF ROUTES.......................................................................
module.exports =router;