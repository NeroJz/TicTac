angular.module('ticTacApp')
    .controller('gameplayCtrl', ['$scope', 'socket', '$rootScope',
        function ($scope, socket, $rootScope) {

            var turn = 0;
            var flag = '';

            $scope.currentPlayer = 'X';
            $scope.player = '';
            $scope.now = 'waiting';
            $scope.winner = null;
            $scope.gameMsg="Waiting Player to join";
            $scope.style = "alert alert-info";
            $scope.returnButton = false;

            $scope.boards = [
                ['-', '-', '-'],
                ['-', '-', '-'],
                ['-', '-', '-'],
            ];

            socket.emit('init game', {
                userId: $rootScope.currentUser._id,
            });

            socket.on('start game', function (data) {

                $rootScope.currentGame = data;

                console.log($rootScope.currentGame);

                if ($rootScope.currentUser._id == data.playerOne) {
                    $scope.player = "one"
                } else {
                    $scope.player = "two"
                }

                $scope.now = "one";
                $scope.gameMsg="Game Starts";
                $scope.style = "alert alert-success";
            });

            socket.on('update game', function (data) {
                $scope.boards = data.game.boards;
                $scope.now = data.game.flag;
                turn = data.turn;

                if (data.game.flag == 'two') {
                    $scope.currentPlayer = 'O';
                } else {
                    $scope.currentPlayer = 'X';
                }

                if (turn == 8) {
                    $scope.gameMsg="Tied Game!";
                    $scope.style = "alert alert-warning";
                    $scope.now = '';

                    socket.emit('tied game', {gameId: $rootScope.currentGame});
                    $scope.returnButton = true;
                    return;
                }
            });

            $scope.isTaken = function (cell) {
                return cell !== '-';
            };

            socket.on('game end', function(data){
                $scope.boards = data.boards;
                console.log(data.winnerId);
                console.log(data.loseId);


                if($rootScope.currentUser._id == data.winnerId){
                    $scope.gameMsg="You Win!";
                    $scope.style = "alert alert-warning";
                }

                if($rootScope.currentUser._id == data.loseId){
                    $scope.gameMsg="Oops You Lose!";
                    $scope.style = "alert alert-danger";
                }
                $scope.returnButton = true;
            });


            $scope.move = function (row, index) {
                turn++;
                $scope.boards[row][index] = $scope.currentPlayer;
                var gameStatus = checkGame($scope.boards);

                if (gameStatus) {
                    $scope.winner = $scope.currentPlayer;
                    var playerWon = '';
                    var playerLose = '';
                    if ($scope.winner == 'X') {
                        playerWon = $rootScope.currentGame.playerOne;
                        playerLose = $rootScope.currentGame.playerTwo;
                    } else {
                        playerWon = $rootScope.currentGame.playerTwo;
                        playerLose = $rootScope.currentGame.playerOne;
                    }

                    var winnerData = {
                        flag: "gameover",
                        winnerId: playerWon,
                        loseId: playerLose,
                        gameId: $rootScope.currentGame
                    };

                    socket.emit('game winner', winnerData);

                    return;
                }

                $scope.currentPlayer = $scope.currentPlayer === 'X' ? 'O' : 'X';

                if ($scope.currentPlayer == 'X') {
                    flag = 'one';
                } else {
                    flag = 'two';
                }

                var socketData = {
                    boards: $scope.boards,
                    flag: flag,
                    id: $rootScope.currentGame._id,
                    turn: turn
                };
                socket.emit('player move', socketData);
            };

            checkGame = function (board) {
                var winner = false;

                for (var i = 0; i < 3; i++) {
                    if ((board[i][0] !== '-') && (board[i][0] == board[i][1]) && (board[i][1] == board[i][2])) {
                        winner = true;
                    }

                    if ((board[0][i] !== '-') && (board[0][i] == board[1][i]) && (board[1][i] == board[2][i])) {
                        winner = true;
                    }
                }

                if ((board[0][0] !== '-') && (board[0][0] == board[1][1]) && (board[1][1] == board[2][2])) {
                    winner = true;
                }
                if ((board[0][2] !== '-') && (board[0][2] == board[1][1]) && (board[1][1] == board[2][0])) {
                    winner = true;
                }

                return winner;
            }

        }]);