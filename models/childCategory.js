const mongoose =require("mongoose");

//page schema
const childCategorySchema=mongoose.Schema({
	title:{
		type:String,
		required:true
	},
	sorting:Number,
	pageLink:{
		type:String,
	},
	pageImage:{
		type:String
	},	
	imageId:{
		type:String
	},
	parentTag:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Page"
	}
});

module.exports = mongoose.model("ChildCategory",childCategorySchema);