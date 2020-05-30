const mongoose =require("mongoose");

//page schema
const pageSchema=mongoose.Schema({
	text:{
		type:String,
		required:true
	},
	sorting:{
		type:Number,
		default:0
	},
	childCategory:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"ChildCategory"
		}
	]	
});

module.exports = mongoose.model("Page",pageSchema);