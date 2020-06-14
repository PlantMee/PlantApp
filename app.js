
//>>>>>>>SETTING ALL THE VARIABLES<<<<<<<<<
require('dotenv').config();
const express 		=require("express"),
	  path 			=require("path"),
	  mongoose		=require("mongoose"),
	  bodyParser 	=require("body-parser"),
	  session   	=require("express-session"),
	  cookieParser  = require("cookie-parser"),
      passport      =require("passport"),
      LocalStrategy =require("passport-local"),
	  config		=require("./config/database"),
	  flash         =require("connect-flash"),
	  methodOverride= require("method-override");

	  var UserPages			=require("./routes/user_pages"),
	  	  ProductCart		=require("./routes/productCart"),
	  	  adminPages		=require("./routes/adminRoutes"),
	  	  adminProductRoutes=require("./routes/adminProductRoutes"),
	  	  userProfile		=require("./routes/userProfile"),
	  	  Admin 		    =require("./models/admin");
	const Page 				=require("./models/page");
	   
//SETTING APP VARIABLE
const app=express();

//CONNECTING TO ONLINE DATABASE
//=======================================

mongoose
     .connect(config.uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
     .then(() => console.log( 'Database Connected' ))
     .catch(err => console.log( err ));
//=======================================

//view engine setup
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
//PUBLIC FOLDER JOIN========>>>>>>>>
app.use(express.static(path.join(__dirname,"public")));
//method override setup
app.use(methodOverride('_method'));
//bodyParser files Setup
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser('secret'));
//express-session setup
app.use(session({
  secret: 'plants are awesome',
  resave: false,
  saveUninitialized: true
}));


//connection flash to prompt error messages
	app.use(flash());
	//passing global variable
		app.use(function(req,res,next){
		res.locals.error =req.flash("error");
		res.locals.success=req.flash("success");
		res.locals.info=req.flash("info");
		next(); 
	})

app.use(passport.initialize());
app.use(passport.session());
/////////////////////////////////////////////////////
passport.use(new LocalStrategy(Admin.authenticate())); 
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

//USer data is stored in this part 
app.use(function (req,res,next){
		res.locals.currentUser = req.user;
		next();
	})



//>>>>>>>>ROUTES<<<<<<<<<<//
app.use(UserPages);
app.use("/admin",adminPages);
app.use("/admin/plant",adminProductRoutes);
app.use(userProfile);
app.use(ProductCart);

//=======START THE SERVER================
const port =process.env.PORT||3000;
app.listen(port,function() {
	console.log("SERVER HAS SATRTED");
})