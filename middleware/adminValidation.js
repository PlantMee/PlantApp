module.exports={
	isLoggedIn:function (req,res,next) {
		if(req.isAuthenticated()){
			if(req.user.isAdmin){
                return next();
            }req.flash("error","YOU ARE NOT AN ADMIN TO GO TO THAT SECTION");
             return res.redirect("/");            
		}
		req.flash("error","YOU NEED TO LOGIN AS ADMIN TO GO AHEAD");
		res.redirect("/admin/login");
	},
	isSuperUser:function(req,res,next){
		if(req.isAuthenticated()){
			if(req.user.isAdmin){
             var isSuperuser=req.user.isSuperuser;
			    if(isSuperuser){
				return next();			    
            } req.flash("error","YOU NEED TO CONTACT SUPERUSER FOR THAT POWER");
              return res.redirect("/admin");
            }req.flash("error","YOU ARE NOT AN ADMIN TO GO TO THAT SECTION");
             return res.redirect("/");					
		}req.flash("error","YOU NEED TO LOGIN AS ADMIN TO GO AHEAD");
		res.redirect("/admin/login");
	}
}