const mongoose =require("mongoose");
//THIS IS THE SECTION WHERE A USER WHO SUBSCRIBED WILL GET MAILS
const emailSubs= new mongoose.Schema({
	email:{
		type:String,
		required:true
	}
})
module.exports=mongoose.model("userSubscribed",emailSubs);