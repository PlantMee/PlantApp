require('dotenv').config();
////////////////////////////////////////////////
const express =require("express"),
		router=express.Router();
const ChildCategory =require("../models/childCategory");
var   Plant 		=require("../models/plantModel");
const Middleware	=require("../middleware/index");
const Validation 	=require("../middleware/adminValidation.js");

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'deepjha98',
  api_key:"696316222696763"||process.env.CLOUDINARY_API_KEY, 
  api_secret:"2EZYqtpnBHlz80XeBCdxJnVPIjE"||process.env.CLOUDINARY_API_SECRET
});
///////////////////////////////

//............Show All Plant Namews along with edit option..........
router.get("/",Validation.isLoggedIn,(req,res)=>{
	 ChildCategory.find({},(err,foundChild)=>{
		 	if(err){
		 		req.flash("error","SOMETHING PROBLEMATIC OCCURED");
		 	}else{
			 	Plant.find({}).populate("category").exec((err,foundPlants)=>{
				 	if (err) {
				 		req.flash("error","SOMETHING PROBLEMATIC OCCURED");
				 	}else{
				 		res.render("adminArea/viewAll",{plantData:foundPlants,childNav:foundChild});				 		
				 	}				 	
				 });	 		
		 	}		 	
		});	
})
/////////////////////////////////////////////////////////////////////////////

//>>>>>>>admin route to add plant page
//form to add new plant
router.get("/new",Validation.isLoggedIn,(req,res)=>{
	 ChildCategory.find({},(err,foundNav)=>{
	 	if(err){
	 		req.flash("error","SOMETHING PROBLEMATIC OCCURED");
	 	}else{
			req.flash("info","ADD DATA ACCURATELY");
			res.render("adminArea/addPlant",{childNav:foundNav}); 			 		
	 	}	 	
	});	
});
//post method of form submission
router.post("/",Validation.isLoggedIn,Middleware.upload.single('inpFile'),(req,res)=>{
	Plant.findOne({name:req.body.name},(err,foundName)=>{
			if(foundName){
				req.flash("error","PLANT NAME ALREADY EXISTS");
				res.redirect("/admin/plant");
			}else{
				cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
				req.body.inpFile=result.secure_url;		
				req.body.imageId=result.public_id;		
				var otherImages =[];
				otherImages.push(result.secure_url);
				var otherNames	=[];
				otherNames.push(req.body.name);
				var newPlant={
					name				:req.body.name,
					otherNames			:otherNames,
					youtube				:req.body.youtube,
					image				:req.body.inpFile,
					imageId 			:req.body.imageId,
					otherimages			:otherImages,
					about				:req.body.about,
					description			:req.body.description,
					wikilink			:req.body.wikilink,
					price				:req.body.price,
					category     		:req.body.category,	
					difficultyLevel		:req.body.difficulty,
					sunlight			:req.body.sunlight,
					soil				:req.body.soil,
					water				:req.body.water,
					features            :req.body.features,
					specification		:{height:req.body.height,
										  spread:req.body.spread}, 
					uses                :req.body.uses,
					quantityAvailable   :req.body.quantityAvailable
				};	
				console.log("you reacghed step 1 ")
				Plant.create(newPlant,(err,newData)=>{
					if (err) {
						req.flash("error",err);
						res.redirect("/admin/plant");
						
					}else{
						
						req.flash("success","NEW PLANT ADDED SUCCESSFULLY");
						res.redirect("/admin");
					}
				})	
	})
				
			}
		})	
});
////////////////////////////////////////////////////////////////////////////

//==========================EDIT PLANT DATA==================
router.get("/:id/edit",Validation.isLoggedIn,(req,res)=>{
	Plant.findById(req.params.id).populate("category").exec((err,foundData)=>{
		if (err) {
			req.flash("error",err);
			res.redirect("back");
		}else{
			//renderShow Edit Page along with the data
			ChildCategory.find({},(err,foundChild)=>{
			 	if(err){
			 		req.flash("error","SOMETHING PROBLEMATIC OCCURED");
			 	}else{	
			 		res.render("adminArea/editProduct",{plant:foundData,childNav:foundChild});
			 	}
			});			
		}
	})
});
router.put("/:id",Validation.isLoggedIn,Middleware.upload.single('inpFile'),(req,res)=>{
	 Plant.findById(req.params.id, async function(err, plant){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(plant.imageId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  plant.imageId = result.public_id;
                  plant.image = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
           			plant.name = req.body.name;
           		    plant.description = req.body.description;
   					plant.youtube=req.body.youtube;				
					plant.about			 =req.body.about;
					plant.description	 =req.body.description;
					plant.wikilink		 =req.body.wikilink;
					plant.price			 =req.body.price;
					plant.category       =req.body.category;	
					plant.difficultyLevel=req.body.difficulty;
					plant.sunlight	     =req.body.sunlight;
					plant.soil		     =req.body.soil;
					plant.water		     =req.body.water;
					plant.features       =req.body.features;
					plant.specification	 ={height:req.body.height,
										  spread:req.body.spread}; 
					plant.uses           =req.body.uses;
					plant.quantityAvailable=req.body.quantityAvailable;
            plant.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/admin/plant");
        }
    });
});
///////////////////////////////////////////////////

//==========================DELETE PLANT DATA==================
router.delete("/:id",(req,res)=>{

})

///////////////////////////////////////////////////

///////////////////////////////////////////////////
module.exports= router;