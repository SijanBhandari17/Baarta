const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const pollSchema = new Schema({
    option : [
        {
           name : {type : String , required : true},
           votes : {type : Number , required : true , default : 0} 
        },
    ]
})
module.exports = mongoose.model('Poll' , pollSchema)