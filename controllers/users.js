const User = require('../model/user');
const Timing = require('../model/timing');

const jwt = require('jsonwebtoken');
const date = require('../midlewares/date')
const _ = require('lodash');
const path = require('path');
const helper = require('../helpers/helper');
const randomstring = require("randomstring");
var set;

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
                Timing.findOne({status:1},(err,response)=>{
                    if(err) {console.log(err)}
                    else if(response){
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
                    }
                    else{
                        re.redirect("/")
                    }
                })
               
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
               
               Timing.findOne({status:1},(err,responses)=>{
                if(err) {console.log(err)}
                else if(responses){
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
            const result=await new User({firstname,lastname,email,address,password,mobile,link,count:1,campaign_id:responses._id});
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
            
             }
             else{
                 res.redirect("/")
             }

            })
           } 
           catch (error) {
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
            Timing.findOne({status:1},(err,response)=>{
                if(err) {console.log(err)}
                else if(response){
            var today = new Date();
            var target = new Date(response.endingDate +','+response.endingTime);
            var currentTime = today.getTime();
            var targetTime = target.getTime();
        
            var time = targetTime - currentTime;
        
            var sec = Math.floor(time/1000);
            var min = Math.floor(sec/60);
            var hrs = Math.floor(min/60);
            var days = Math.floor(hrs/24);

            hrs = hrs % 24;
            min = min % 60;
            sec = sec % 60;
        
        
            hrs = (hrs<10) ? "0"+hrs : hrs;
            min = (min<10) ? "0"+min : min;
            sec = (sec<10) ? "0"+sec : sec;
           
             let timedown ={days:days,hrs:hrs,min:min,sec:sec}
            
            var set;
            if(time > 0){
                console.log(time)
            //   set =  setTimeout(users.admin, 1000);
            }else{
                console.log(time)
                let update = {$set : {status:0}}
                Timing.updateOne({status:1},update,(err,result)=>{
                    if(err) throw err;

                })
                // clearTimeout(set)
            }
            User.find({isAdmin:false,campaign_id:response._id}).sort([['count', 'desc']]).exec(function(err, docs) { 
                if(!err && docs){
                    // let sort = docs.sort(function(a, b){return b.count - a.count})
                    let filt = docs.find(e =>{
                        return  e._id == req.user_data.user
                    })
                    if (filt) {
                        res.render('display',{message:"successful",users:docs,user_id:req.user_data,link:filt.link,count_down:timedown});
                    } else { 
                        res.render('display',{message:"successful",users:docs,user_id:req.user_data,link:null,count_down:timedown});
                        
                    }
                }
                else{ 
                 res.render('display',{message:"error occure"});

                }

            })
             }
             else{
                res.render('display',{message:"No campaign goin on",users:null,user_id:null,link:null,count_down:null});
             }
                        
                    })
          }
          catch (error) {
            res.render('display',{message:"error occure"});

          }
    },
    create_time: async (req,res)=>{
        try {
            let {end}=req.body
           console.log(date.fullDate)
           if(end){
               let response = await Timing({
                   startingDate:date.fullDate,
                   startingTime:date.time,
                   endingDate:end,
                   endingTime:date.time,
                   created_by:req.user_data.user
                })
                response.save((err,result)=>{
                    if(err) throw err;
                    
                res.redirect('/admin');
                })
           }
          }
          catch (error) {
            res.render('admin',{message:"error occure"});

          }
    },
    admin: async(req,res)=>{
         try {
            Timing.findOne({status:1},(err,response)=>{
                if(err) {console.log(err)}
                else if(response){
                    console.log(response)
                    var today = new Date();
            var target = new Date(response.endingDate +','+response.endingTime);
            var currentTime = today.getTime();
            var targetTime = target.getTime();
        
            var time = targetTime - currentTime;
        
            var sec = Math.floor(time/1000);
            var min = Math.floor(sec/60);
            var hrs = Math.floor(min/60);
            var days = Math.floor(hrs/24);

            hrs = hrs % 24;
            min = min % 60;
            sec = sec % 60;
        
            hrs = (hrs<10) ? "0"+hrs : hrs;
            min = (min<10) ? "0"+min : min;
            sec = (sec<10) ? "0"+sec : sec;
           
             let timedown ={days:days,hrs:hrs,min:min,sec:sec}
            
            var set;
            if(time <= 0){
                let update = {$set : {status:0}}
                Timing.updateOne({status:1},update,(err,result)=>{
                    if(err) throw err;
                  
                })
            }
            User.find({isAdmin:false,campaign_id:response._id}).sort([['count', 'desc']]).limit(10).exec(function(err, docs) { 
                if(!err && docs){
                    // let reses = users.countDown()
                 res.render('setup',{message:"successful",users:docs,user_id:req.user_data,count_down:timedown,endin:response.endingDate });
                }
                else{ 
                 res.render('setup',{message:"error occure"});

                }

            })
             }
             else{
                res.render('setup',{message:"No available campaign initiate one",users:null,user_id:null,count_down:null,endin:null });
             }
                        
                    })

             
         } 
         catch (error) {
             console.log(error)
            res.render('setup',{message:"error occure"});
             
         }
            
 },

  
// function startCountDownTimer(){
	
// }
    


};
module.exports = users;