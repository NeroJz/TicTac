var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/tictac');

var db = mongoose.connection;

//Schema
var UserSchema = mongoose.Schema({
    username:{
        type:String,
        index: true
    },
    password:{
        type:String
    },
    win:{
        type:Number,
        default: 0
    },
    lose:{
        type:Number,
        default: 0
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUsers = function(callback){
    User.find(callback);
};

module.exports.createUser = function(newUser, callback){
    newUser.save(callback);
};

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
};

module.exports.comparePassword = function(candidatePassword, password, callback){
    if(candidatePassword != password){
        callback(false);
        return;
    }
    var isMatch = true;
    callback(null, isMatch);
};