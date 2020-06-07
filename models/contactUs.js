const mongoose =require("mongoose");
//THIS IS THE SECTION WHERE USER CAN SUBMIT CONTACT REQUESTS
const contactUs= new mongoose.Schema({
	userName:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	subject:{
		type:String,
		required:true
	},
	message:{
		type:String,
		required:true
	},
	contacted:{
		type:Boolean,
		default:false,
		required:true
	}
})
module.exports=mongoose.model("contactUs",contactUs);