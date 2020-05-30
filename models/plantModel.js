const mongoose =require("mongoose");

const plantSchema =new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	othernames:[],
	youtube:String,
	image:{
		type:String,
		required:true
	},
	imageId:String,
	otherimages:[],
	category:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"ChildCategory"
	},
	price:{
		type:Number,
		required:true
	},
	quantityAvailable:Number,
	quantitySold:{
		type:Number,
		default:0
	},
	description:String,
	about:String,
	sunlight:[],
	water:[],
	soil:[],
	features:String,
	specification:{
		height:Number,
		spread:Number
	},
	wikilink:String,
	difficultyLevel:{
		type:Number,
		default:4
	},
	uses:String
})

module.exports =mongoose.model("Plant",plantSchema);