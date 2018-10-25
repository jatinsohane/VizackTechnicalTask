var express =     require("express"),
    app     =     express(),
    bodyParser = require("body-parser"),
    mongoose       =  require("mongoose"),
    User           = require("./models/user.js"),
    Time           = require("./models/time.js"),
    methodOverride =  require("method-override"),
    passport       =  require("passport"),
    LocalStrategy  =                require("passport-local"),
    passportLocalMongoose =                require("passport-local-mongoose");
    
    
    
     app.locals.moment = require('moment');
    
    
        
 mongoose.connect("mongodb://localhost/att_db");
 app.use(bodyParser.urlencoded({ extended:true }));//line mandatory for using body parser and using post request
    
    
mongoose.set('useCreateIndex', true);
app.set("view engine","ejs");


app.use(express.static(__dirname+"/public"));

app.use(methodOverride("_method"));//"_method"-default syntax we have to write always
 
//PASSPORT CONFIGURATION
app.use(require("express-session")({//firstly secret(this line) should be written before writing app.use(passport.session())
    secret:"lets do this task",
    resave:false,
    saveuninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));
// //passport.use(User.createStrategy());-->from stack overflow
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());
 app.use(function(req,res,next){//we are passimg a middleware here so that we can apply show and hide logic of signup and login button of navbar 
    res.locals.currentUser= req.user;//res.locals is a inbuilt method of passport which will allow use to use req.user object(here) as a middleware,here we are passing current user to every single template
     
     //  res.locals.error    = req.flash("error");//res.locals will allow us to use res.locals.message method in all other templates(ejs) 
     //  res.locals.success    = req.flash("success");
      next();
 })



app.get("/",function(req,res){
    res.render("landing");
})

app.get("/welcome",function(req, res) {
    Time.find({},function(err,found){
        if(err){
            console.log(err)
        }
        else{
            res.render("welcome",{found:found});
        }
    })
    
})

app.post("/welcome",function(req, res) {
    var lunch_time_in=req.body.startTime;
    
    Time.create(lunch_time_in,function(err,newlyCreated){
        if(err){
            console.log(err)
        }
        else{
            console.log(lunch_time_in);
            res.redirect("/welcome");
        }
    })
    
})

app.get("/admin",function(req, res) {
    User.find({},function(err,users){
        if(err){
            console.log(err)
        }
        else{
            res.render("admin",{users:users});
        }
    })
    
});

//EDIT ROUTE
app.get("/admin/:id/edit",function(req, res) {
   User.findById(req.params.id,function(err,foundUser){
       if(err){
           res.redirect("/admin");
       }else{
           res.render("edit",{user:foundUser});
       }
   }) 
});





app.put("/admin/:id",function(req,res){
    
    User.findByIdAndUpdate(req.params.id,req.body.update,function(err,updateddata){
        if(err){
            res.redirect("/admin")
        }else{
            res.redirect("/admin");
        }
    })
})


//DELETE ROute
app.delete("/admin/:id",function(req,res){
    //Destroy Blog
    User.findByIdAndRemove(req.params.id,function(err){
        if(err){
        res.redirect("/admin");
         //Redirect Somewhere
        }else{
            res.redirect("/admin");
        }
    })
   
    
})


//REGISTER FORM   
app.get("/register",function(req, res) {
    res.render("register");
})   



//Handle sign Up logic
app.post("/register",function(req, res) {///always restart the server when you add the new route in
      
    var newUser =new User({username:req.body.username,mobile:req.body.mobile});
    User.register(newUser,req.body.password,function(err,user){//this "user"  will be newly created user
        if(err){
             console.log(err);
            // req.flash("error",err.message);//here err is built in error message from passport,and thus we dont have to type it in
             res.redirect("/register");
        }
        
        passport.authenticate("local")(req,res,function(){
            // req.flash("success","Welcome to YelpCamp" + " "+user.username);//we can also take username frm req.body.username,but here we are taking username which is dirctly coming from db
            // res.redirect("/campgrounds");
            res.redirect("/welcome");
        })
        
        
    });
});





//LOGIN FORM
app.get("/login",function(req, res) {
    res.render("login")//defining key value pair of message
});


app.post("/login",isAdmin,passport.authenticate("local",{
    
    
    successRedirect:"/welcome",
    failureRedirect:"/login"
}),function(req, res) {
    
    
});



app.get("/logout",function(req,res){
    req.logout();
    // req.flash("success","Logged You out");
    res.redirect("/");
});


function isAdmin(req,res,next){
    if(req.body.username=="admin"&req.body.password=="admin"){
      req.body.admin=true;
        res.redirect("/admin")
    }
    
    else{
        return next()
    }  
      
      
        
   }
   
//   function time(req,res,next){
//      var start = Date.now();
//     res.on('header', function() {
//         var duration = Date.now() - start;
//         console.log(duration);
//     });
// }
app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Basic Node App server has started")
});