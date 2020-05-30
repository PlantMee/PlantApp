const express = require("express"),
	  router=express.Router(),
	  passport = require("passport");
const Page =require("../models/page");
var   ChildCategory=("../models/childCategory");
var   Plant 		=require("../models/plantModel");
const User 			=require("../models/admin");
const Validation 	=require("../middleware/userValidation.js");
//.............................................................................................



router.get("/cart/:id/remove",(req,res)=>{
	
})




///..........END OF ROUTES.......................................................................
module.exports =router;