var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GenreSchema = new Schema({
    
    genre:{type:String,required:true}

})

module.exports=mongoose.model('Genre',GenreSchema)