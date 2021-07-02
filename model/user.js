let mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltingRounds=10
const Schema = mongoose.Schema
let user_schema = new Schema({
      firstname:{type:String,required:true,},
      lastname:{type:String,required:true,},
      email:{type:String,required:true,trim:true,unique:true},
      address:{type:String,required:true,},
      isAdmin:{type:Boolean,default:false},
      password:{type:String,required:true,trim:true},
      mobile:{type:String,required:true,trim:true},
      count:{type:Number},
      link:{type:String},
      campaign_id:{type:String},

})
user_schema.pre('save',(next)=>{
    const user = this;
    if(!user.isModified){next();}

    else{bcrypt.hash(user.password,saltingRounds,(err,hash)=>{
       if(err){console.log('Error hashing password for user', user.name);next(err)}
    else{ user.password = hash; next();}
    })}
})
let users = mongoose.model('users', user_schema);
module.exports = users;