var mongoose = require("mongoose");

var reviewSchema = mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    star:{
    	type:Number,
    	required:true
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin"
        }
    },
    username:{
        type:String,
  
    }
});

module.exports = mongoose.model("Reviews", reviewSchema);