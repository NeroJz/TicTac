angular.module('ticTacApp')
    .controller('gameplayCtrl', ['$scope', 'socket', '$rootScope',
        function ($scope, socket, $rootScope) {

            var turn = 0;
            var flag = 'first';

            $scope.currentPlayer = 'X';
            $scope.player = '';
            $scope.now = '';
            $scope.winner = null;

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
                    $scope.player = "first"
                } else {
                    $scope.player = "second"
                }

                $scope.now = "first";
            });

            socket.on('update game', function (data) {
                $scope.boards = data.boards;
                $scope.now = data.flag;

                if (data.flag == 'second') {
                    $scope.currentPlayer = 'O';
                } else {
                    $scope.currentPlayer = 'X';
                }
            });

            $scope.isTaken = function (cell) {
                return cell !== '-';
            };


            $scope.move = function (row, index) {
                turn++;
                $scope.boards[row][index] = $scope.currentPlayer;
                var gameStatus = checkGame($scope.boards);

                if (gameStatus) {
                    $scope.winner = $scope.currentPlayer;
                    alert($scope.winner + " wins.");
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
                if (turn == 9 && gameStatus == false) {
                    alert("Tied game!");
                    return;
                }

                $scope.currentPlayer = $scope.currentPlayer === 'X' ? 'O' : 'X';

                if ($scope.currentPlayer == 'X') {
                    flag = 'first';
                } else {
                    flag = 'second';
                }

                var socketData = {
                    boards: $scope.boards,
                    flag: flag,
                    id: $rootScope.currentGame._id
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