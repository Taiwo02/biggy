const User = require('../model/user');
const jwt = require('jsonwebtoken');
const date = require('../midlewares/date')
const _ = require('lodash');
const path = require('path');
const helper = require('../helpers/helper');
const randomstring = require("randomstring");

// data = [{
//     firstname:"admin",
//     lastname:"admin",
//     email: 'user1@gmail.com',
//     password: '123456',
//     address:"Admin address",
//     isAdmin: true
// }];

// beforeEach(async () => {
//     await User.create(data)
//   })
let users = {
    home:async(req,res)=>{
     try {
        res.render('welcome');
        } catch (error) {
         }
        },
        renderReg:async(req,res)=>{
            try {
                if( req.params.id != 'register'){
                    User.findOne({link:req.params.id},(err,response)=>{
                        console.log(req.params.id)
                        if(err) {
                            console.log(err)
                            }
                        else if(response){
                            res.render('register',{query : req.params.id,message:null});
                        }
                        else{
                          res.render('error',{message:"Url not found"});
                        }
                     })
                }
                else{
                    res.render('register',{query : req.params.id,message:null});
                }
               } catch (error) {
                }
               },
               renderLog:async(req,res)=>{
                try {
                   res.render('login',{message:null});
                   } catch (error) {
                    }
                   },
    create: async (req, res)=> {
           try {
               let link_id = req.params.id;
               
               if(link_id){
                   let user_detaiils =  User.findOne({link:link_id},(err,response)=>{
                       if(err) throw error;

                       else if(response){
                           console.log(response)
                           update = { $set: {count:parseInt(response.count+1)}};
                           User.updateOne({_id:response._id},update,(err,result)=>{
                              if(err){
                                  console.log(err)
                              }
                           }) 

                       }
                    })
               }
            let link = `REG${randomstring.generate({
                length: 5,
                charset: "numeric",
              })}${Date.now()}`;
            const {firstname,lastname,email,address,password,mobile} = req.body; 
            const result=await new User({firstname,lastname,email,address,password,mobile,link,count:1});
            result.save(function(error,response){
                if(response && !error){ 
                    res.redirect('/login');

                }
                else{
                   var mess = ''
                    let messages = error.message;
                    let dublicate =  messages.search("duplicate key");
                    let firstname = messages.search("`firstname` is required.");
                    let lastname = messages.search("`lastname` is required.");
                    let email = messages.search("`email` is required.");
                    let address = messages.search("`address` is required.");
                    let mobile = messages.search("`mobile` is required.");
                    let password = messages.search("`password` is required.");
                    if(dublicate>0){
                      mess = "duplicate"
                    }
                    else if(firstname>0){
                        mess = "Firstname is required."
                    }
                    else if(lastname>0){
                        mess = "Lastname is required."
                    }
                    else if(email>0){
                        mess = "Email is required."
                    }
                    else if(address>0){
                        mess = "Address is required."
                    }
                    else if(mobile>0){
                        mess = "Mobile is required."
                    }
                    else if(password>0){
                        mess = "Massword is required."
                    }
                    res.render('register',{message:mess});

                }
            })
           } catch (error) {
            res.render('register',{message:"An error occure"});

           }
    },
    login: async (req,res)=>{
        try {
            const {email,password}=req.body;
            User.findOne({email,password},(err,user)=>{
            if(!err && user){
            const payload = { user: user._id};
            const secret ='hello';
            // const token = jwt.sign(payload, secret);
            var token = jwt.sign(payload, secret, {
                // expiresInMinutes: 1440
            });
            res.cookie('auth',token);
               if(user.isAdmin == true){
                res.redirect("/admin")

               }
               else{
                   res.redirect("/dashboard")
               }
            }
            else{
                res.render('login',{message:'invalid email or password'});
            }
            });
          }
          catch (error) { console.log(error)}
    },
    dashboard: async (req,res)=>{
        try {
            User.find({isAdmin:false}).sort([['count', 'desc']]).exec(function(err, docs) { 
                if(!err && docs){
                    // let sort = docs.sort(function(a, b){return b.count - a.count})
                    let filt = docs.find(e =>{
                        return  e._id == req.user_data.user
                    })
                    if (filt) {
                        res.render('display',{message:"successful",users:docs,user_id:req.user_data,link:filt.link});
                    } else { 
                        res.render('display',{message:"successful",users:docs,user_id:req.user_data,link:null});
                        
                    }
                }
                else{ 
                 res.render('display',{message:"error occure"});

                }

            })
          }
          catch (error) {
            res.render('display',{message:"error occure"});

          }
    },
    admin: async (req,res)=>{
        try {
            User.find({isAdmin:false}).sort([['count', 'desc']]).limit(10).exec(function(err, docs) { 
                if(!err && docs){
                 res.render('setup',{message:"successful",users:docs,user_id:req.user_data});

                }
                else{ 
                 res.render('admin',{message:"error occure"});

                }

            })
          }
          catch (error) {
            res.render('admin',{message:"error occure"});

          }
    },
    create_time: async (req,res)=>{
        try {
            User.find({isAdmin:false}).sort([['count', 'desc']]).limit(10).exec(function(err, docs) { 
                if(!err && docs){
                 res.render('setup',{message:"successful",users:docs,user_id:req.user_data});

                }
                else{ 
                 res.render('admin',{message:"error occure"});

                }

            })
          }
          catch (error) {
            res.render('admin',{message:"error occure"});

          }
    },
    


};
module.exports = users;