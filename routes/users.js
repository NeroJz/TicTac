var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


router.get('/getUsers', function (req, res, next) {
    User.getUsers(function (err, users) {
        if (err) throw err;
        res.json(users);
    });
});

router.post('/register', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    //Check for errors
    var errors = req.validationErrors();

    if (errors) {
        res.json(500, errors);
        return;
    } else {
        var newUser = new User({
            username: username,
            password: password
        });

        User.createUser(newUser, function (err, user) {
            if (err) throw err;
            console.log(user);
            res.json(user);
        });

        req.flash('success', 'You are now registered and may log in');

    }
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err){
                return done(err);
            }
            if(!user){
                console.log('Unknown User');
                return done(null, false, {alert: 'Incorrect username!'});
            }
            if(user.password != password){
                return done(null, false, {alert: 'Incorrect password!'});
            }
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()) return next;
    res.send(401);
}

router.get('/currentUser', isAuthenticated, function(req, res){
    console.log(res.user);
    res.json(req.user);
});

router.post('/login', passport.authenticate('local'), function (req, res) {
    res.json(req.user);
});

router.get('/logout', function(req, res){
    console.log('logout');
    req.logout();
    res.send(200);
});

module.exports = router;
