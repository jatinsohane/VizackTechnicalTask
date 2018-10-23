var mongoose = require("mongoose");
var    passportLocalMongoose=require("passport-local-mongoose");

var UserSchema = mongoose.Schema({
    username:String,
    password:String,
    mobile:String,
    admin:{type:Boolean,default: false},
    
});

UserSchema.plugin(passportLocalMongoose);//adds some pre defined methods to the userSchema

module.exports = mongoose.model("User",UserSchema);