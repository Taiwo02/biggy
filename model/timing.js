let mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltingRounds=10
const Schema = mongoose.Schema
let date_schema = new Schema({
      starting:{type:String,required:true,},
      ending:{type:String,required:true,},
})
let dates = mongoose.model('dates', date_schema);
module.exports = dates;