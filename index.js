const express = require('express');
var cookieParser = require('cookie-parser')
const app = express();
const bodyparser = require('body-parser');
const routes = require('./routes/routes')
const mongoose = require('mongoose');
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost/local'
const client =  mongoose.connect(mongoURL, { useNewUrlParser: true,useUnifiedTopology: true  });
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(cookieParser())
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use('/',routes);


// app.get('/', function(req, res) {
//     res.render('register');
//   });
app.listen(process.env.PORT || 5000,(err)=>{
    console.log('You are listen to port 5000');
})



