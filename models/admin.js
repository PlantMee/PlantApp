const mongoose = require("mongoose");
	  passportLocalMongoose=require("passport-local-mongoose");

var AdminSchema = new mongoose.Schema({
	username:String,
	firstName:{
		type:String,
		required:true
	},
	lastName:{
		type:String,		
	},
	email:{
		type:String,
		required:true
	},
	password:{
		type:String,
	},
	phone:{
		type:Number,
		required:true
	},
	isSuperuser:{
		type:Boolean,
		default:false
	},
    isAdmin:{
        type:Boolean,
        default:false,
        required:true
    },
	profilePic:{
		type:String
	},
	secret:{
		type:String,		
	},
	gender:{
		type:String,
		required:true
	},
	address:{
		house:String,
		streetAddress:String,
		city:String,
		state:String,
		pincode:Number
	},
	orders:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"orders"
	}],
	cart:[{
			"plantId":String,
			"plantName":String,
			"plantImage":String,
			"plantDesc":String,
			"price":Number,
			"quantity":Number
		}	
	]
});
AdminSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("Admin",AdminSchema);