module.exports={
		isLoggedIn:function(req,res,next){
			if(req.isAuthenticated()){
				return next();
			}else{
				req.flash("error","PLEASE LOG IN FIRST TO FOLLOW THAT SECTION ");
			    res.redirect("/login");
			}
		}
}