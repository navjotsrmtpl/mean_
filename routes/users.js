const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config= require('../config/database');
const path = require('path');

const User = require('../models/user');
var multer = require('multer');
var DIR = './uploads';
// var upload = multer({dest: DIR}).single('photo');

// router.get('/image', function(req, res, next) {
//   // render the index page, and pass data to it.
//     res.render('index', { title: 'Express' });
//   });

// router.post('/image', function (req, res, next) {
//   var path = '';
//   upload(req, res, function (err) {
//      if (err) {
//        // An error occurred when uploading
//        console.log(err);
//        return res.status(422).send("an Error occured")
//      }  
//      path = req.file.path;
//      return res.send("Upload Completed for "+path); 
//  });	 
// })



let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  }
});
let upload = multer({storage: storage});



router.get('/images', function (req, res) {
// res.end('file catcher example');
// Photo.find({}, ['path','caption'], {sort:{ _id: -1} }, function(err, photos) {
//   res.render('index', {photolist : Image});

});

router.post('/image',upload.single('Image'), function (req, res) {
  if (!req.file) {
      console.log("No file received");
      return res.send({
        success: false,
        image:''
      });
  
    } else {
      console.log('file received');
      console.log(req.file.filename)
      return res.send({
        success: true,
        image:req.file.filename
      })
    }

});



//Register
router.post('/register',upload.single('Image'), function(req, res){

  const url= req.protocol + '://' + req.get("host");
 console.log(res.body);
    let newUser= new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        image:url + "/uploads/" + req.body.image
       
    });

    User.addUser(newUser, (err,user)=>{
        if(err){
          console.log(newUser)
            res.json({
                success:false,
                msg: "failed to register user"
                
            });
        }else{
          console.log(req.body.image)
            res.json({
                success: true,
                msg:"User registered"
            })
        }
    });
  
});

//Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
  
    User.getUserByUsername(username, (err, user) => {
      if(err) throw err;
      if(!user){
        return res.json({success: false, msg: 'User not found'});
      }
  
      User.comparePassword(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
          const token = jwt.sign({data: user}, config.secret, {
            expiresIn: 604800 // 1 week
          });
  
          res.json({
            success: true,
            token: `Bearer ${token}`,
            user: {
              id: user._id,
              name: user.name,
              username: user.username,
              email: user.email,
              image:user.image
            }
          });
        } else {
          return res.json({success: false, msg: 'Wrong password'});
        }
      });
    });
  });

//Profile
router.get('/profile',passport.authenticate('jwt',{session:false}),(req, res, next)=>{
          res.json({user: req.user})
});


module.exports= router;