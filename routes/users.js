var express = require('express');
var router = express.Router();

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/getUsers', function(req, res, next){
  User.getUsers(function(err, users){
    if(err) throw err;
    res.json(users); 
  });
});

router.post('/register', function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  //Check for errors
  var errors = req.validationErrors();

  if(errors){
    res.json(500, errors);
    return;
  }else{
    var newUser = new User({
      username: username,
      password: password
    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
      res.json(user);
    });

    req.flash('success', 'You are now registered and may log in');

  }

});

module.exports = router;
