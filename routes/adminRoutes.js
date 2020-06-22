const express =require("express"),
		router=express.Router();
		passport = require("passport");
const Page 			= require("../models/page");
const ChildCategory =require("../models/childCategory");
const Validation 	=require("../middleware/adminValidation.js");
var Admin 	 		=require("../models/admin");
const Middleware	=require("../middleware/index");


var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'deepjha98',
  api_key:"696316222696763"||process.env.CLOUDINARY_API_KEY, 
  api_secret:"2EZYqtpnBHlz80XeBCdxJnVPIjE"||process.env.CLOUDINARY_API_SECRET
});
///////////////////////////////

//SETTING APP VARIABLE
router.get("/",Validation.isLoggedIn,function (req,res) {
	res.render("adminArea/index",{
		title:"Plantae_Admin"
	});		
});
//============ROUTE TO ADD NEW PAGE IN NAV BAR===
router.get("/pages/new",Validation.isLoggedIn,(req,res)=>{
	res.render("adminArea/addPage");
});

router.post("/pages",Validation.isLoggedIn,(req,res)=>{
	var pageTitle=req.body.page.toUpperCase();
	Page.findOne({text:pageTitle},(err,foundName)=>{
		if(foundName){
			req.flash("error","PAGE ALREADY EXISTS");
			res.redirect("back")
		}else{
			Page.create({text:pageTitle},(err,newlyCreated)=>{
				if (err) {
					req.flash("error",err)
				}else{
					req.flash("success","SUCCESSFULLY ADDED NEW PARENT CATEGORY")
					res.redirect("/admin");
				}
			});
		}	
	})			
});
//=====================================================

//============ADMIN REGISTRATION=======================
router.get("/register",Validation.isSuperUser,(req,res)=>{
	res.render("./adminArea/registerAdmin");
});
router.post("/",Validation.isSuperUser,(req,res)=>{
	Admin.findOne({email:req.body.admin.email},(err,foundData)=>{
		if(foundData){
			//email Validation
			req.flash("error","THAT EMAIL ALREADY EXISTS");
			return	res.redirect("back");
		}else{
			Admin.findOne({phone:req.body.admin.phone},(err,foundAnother)=>{
				if(foundAnother){
					//phone no validation
					req.flash("error","PHONE NO ALREADY EXISTS");
					res.redirect("/admin/register");
				}else{
					if(req.body.firstPass===req.body.password){
					//everything after validation is done
						req.body.admin.email.toLowerCase();
						req.body.admin.firstName.toUpperCase();
						if(req.body.admin.lastName){
							req.body.admin.lastName.toUpperCase();
						}
						var newAdmin = new Admin({});
						newAdmin=req.body.admin;
						newAdmin.username=req.body.admin.email;	
                        newAdmin.isAdmin=true;
						if(req.body.isSuperUser==="true"){
							newAdmin.isSuperuser=true;
						}else{
							newAdmin.isSuperuser=false;
						}
						//adding data into database after serializing it
						Admin.register(newAdmin,req.body.password,(err,user)=>{
							if(err){
								console.log(err);
								req.flash("error",err.message);
								return res.redirect("/admin/register");
							}
							req.flash("success","SUCCESSFULLY REGISTERED NEW ADMIN");
							res.redirect("/admin")
						})		
					}else{
						req.flash("error","PASSWORD ENTERED DO NOT MATCH");
						res.redirect("back");
					}
				}
			})
		}
	})
});
//=====================================================
//==============LOGIN ROUTES===========================
router.get("/login",(req,res)=>{
	res.render("adminArea/login")
});

router.post("/login",passport.authenticate("local",{
	successRedirect: "/admin",
	failureRedirect: "/admin/login",
    failureFlah:true
}),(req,res)=>{
	
});
//=====================================================

//==============ADMIN LOGOUT==========================
router.get("/logout",(req,res)=>{
	req.logout();
	req.flash("success","SUCCESSFULLY LOGGEED OUT.....");
	res.redirect("/admin/login");
});
//=====================================================

//==========ROUTE TO ADD CHILD ELEMENTS OF NAV BAR==
router.get("/childNav/new",Validation.isLoggedIn,(req,res)=>{	
	//+++++++NAVBAR ELEMENTS++++++++++
 Page.find({},(err,parentNav)=>{
	 	if(err){
	 		console.log(err);
	 	}else{
	 		res.render("adminArea/addChildNav",{parentNav:parentNav}); 		
	 	}	 	
	}); 
});
///////////////////////////////	
router.post("/childNav",Validation.isLoggedIn,(req,res)=>{
 ChildCategory.findOne({title:req.body.title},(err,foundItem)=>{
 	if(foundItem){
 		req.flash("error","CHILD NAVBAR ITEM ALREADY EXISTS");
 		res.redirect("back");
 	}else{
 		Page.findById(req.body.parentTag,function(err,pageAdd) {
		if (err) {
			console.log(err);
		}else{
				var title=req.body.title.toUpperCase();
				var newChild={title:title,
							  parentTag:req.body.parentTag
								};
				ChildCategory.create(newChild,(err,child)=>{
				if (err) {
				console.log(err);
				}else{				
					pageAdd.childCategory.push(child);
					pageAdd.save((err,data)=>{
						if (err) {
							req.flash("error",err);
						}else{
							req.flash("success","SUCCESSFULLY ADDED CHILD CATEGORY");
							res.redirect("/admin/childNav/new");
						}
					})

				}
	})
		}
	})
 	}
 })	
});
//================================================================================
////route to edit child categories data
//Route to edit page
router.get("/childNav/:id/edit",Validation.isLoggedIn,(req,res)=>{
	ChildCategory.findById(req.params.id).populate("parentTag").exec((err,foundData)=>{
		if (err) {
			req.flash("error",err);
			res.redirect("back");
		}else{
				//+++++++NAVBAR ELEMENTS++++++++++
	 	    Page.find({},(err,parentNav)=>{
			 	if(err){
			 		console.log(err);
			 	}else{
			 		console.log(foundData);	
					 		//renderShow Edit Page along with the data
					res.render("adminArea/editChildCategory",{childCategory:foundData,parentNav:parentNav});				 		
			 	}	 	
			});				
		}
	})
});
///////////////////////////////////////
//ROute to tackle edit categoty request
 router.put("/childNav/:id",Validation.isLoggedIn,Middleware.upload.single('pageImage'),(req,res)=>{ 	 	 
	  ChildCategory.findById(req.params.id, async function(err, child){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {                  
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  child.imageId = result.public_id;
                  child.pageImage = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }   
            child.title=req.body.title;
            

            child.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/admin/plant");
        }
    });
 })
 //================================================================================
//EXPORTING ADMIN DATA
module.exports=router;