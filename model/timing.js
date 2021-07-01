let mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltingRounds=10
const Schema = mongoose.Schema
let date_schema = new Schema({
      startingDate:{type:String,required:true},
      startingTime:{type:String,required:true},
      endingDate:{type:String,required:true},
      endingTime:{type:String,required:true},
      created_by:{type:String,required:true},
      status:{type:String,default:1},

})
let dates = mongoose.model('dates', date_schema);
module.exports = dates;