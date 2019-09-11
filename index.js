const express = require ('express');
const path = require('path');
const bodyParser= require('body-parser');
const cors= require('cors');
const passport= require('passport');
const mongoose = require('mongoose');
const config= require('./config/database');



const app= express();

mongoose.connect(config.database);

mongoose.connection.on('connected', ()=>{
    console.log('connect to database',config.database);
})

mongoose.connection.on('error', (error)=>{
    console.log('error',error);
})

const users= require('./routes/users');
//cors mddleware
app.use(cors());

app.use(function (req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST');
res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
res.setHeader('Access-Control-Allow-Credentials', true);
next();
});

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads",express.static(path.join(__dirname, '/uploads')));

// app.use("/uploads",express.static(path.join(__dirname,"public/uploads")))

require('./config/passport')(passport);

app.use('/users', users);

//index route
app.get('/',(req,res)=>{
    res.send("testing")
});


//start server
app.listen(3000 , ()=>{
    console.log("server running on port 3000");
    
})


