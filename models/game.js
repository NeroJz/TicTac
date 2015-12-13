var mongoose = require('mongoose');

//Schema
var GameSchema = mongoose.Schema({
    created:{
        type: Date
    },
    boards:{
        type: Array,
    },
    playerOne:{
        type:String,
    },
    playerTwo:{
        type:String,
    },
    flag:{
        type:String,
    }
});

var Game = module.exports = mongoose.model('Game', GameSchema);


module.exports.createNewGame = function(newGame, callback){
  newGame.save(callback);
};

module.exports.getGameById = function(id, callback){
    Game.findById(id, callback);
};

module.exports.updatePlayer2 = function(id, data, callback){
    var playerTwo = data.playerTwo;
    var query = {_id: id};

    Game.findById(id, function(err, game){
        if(!game){
            console.log('Could not load game');
        }else{
            game.playerTwo = playerTwo;
            game.save(callback);
        }
    });
};

module.exports.updateGamePlay = function(id, data, callback){
    var boards = data.boards;
    var flag = data.flag;

    var query = {_id: id};

    Game.findById(id, function(err, game){
        if(!game){
            console.log('Could not load game');
        }else{
            game.boards = boards;
            game.flag = flag;
            game.save(callback);
        }
    });
};

module.exports.findGameByUserId = function(id, callback){
    var query = {
        $or:[
            {playerOne: id},
            {playerTwo: id}
        ]
    };

    Game.find(query, callback);
};

module.exports.deleteGame = function(id, callback){
    Game.find({_id: id}).remove(callback);
};
