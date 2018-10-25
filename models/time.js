var mongoose = require("mongoose");


var timeSchema = mongoose.Schema({

   
    startTime: Date,
   
    
    
},

{
 timestamps: true,
});


module.exports = mongoose.model("Time",timeSchema);