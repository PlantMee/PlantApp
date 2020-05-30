var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var	imageFilter=function (req, file, cb) {
	    // accept image files only
	    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
	        return cb(new Error('Only image files are allowed!'), false);
	    }
	    cb(null, true);
	};
module.exports={
	upload : multer({ storage: storage, fileFilter: imageFilter})
}