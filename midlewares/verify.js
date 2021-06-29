const jwt = require('jsonwebtoken');
const User = require('../model/user')
module.exports = {
  Verify: (req, res, next) => {
     try{
            let _id = req.user_data.user
            User.findOne({_id},(error,response)=>{
                if(!error && response){
                    // console.log(response.isAdmin)
                    if (response.isAdmin == true) {
                        next()
                        
                    } else {
                        // console.log(error)
                        res.redirect("/login")
                       
                   }
                }
            })
        }
       catch (err) {
        res.status(500).send(err)
        // throw new Error(err);
      }

    }
};