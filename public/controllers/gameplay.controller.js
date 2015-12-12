angular.module('ticTacApp')
    .controller('gameplayCtrl', ['$scope', 'socket', '$rootScope',
        function ($scope, socket, $rootScope) {
            var turn = 0;

            $scope.currentPlayer = 'X';
            $scope.player = '';
            $scope.now = '';
            $scope.winner = null;

            $scope.board = [
                ['-', '-', '-'],
                ['-', '-', '-'],
                ['-', '-', '-'],
            ];

            $scope.isTaken = function (cell) {
                return cell !== '-';
            };

            // Init
            //socket.on('init', function(data){
            //    $scope.player = data.player;
            //
            //    if(data.player == "first"){
            //        $scope.now = 'first';
            //    }
            //
            //});

            socket.on('updateGamePlay', function(data){
                $scope.board = data.board;
                $scope.now = data.now;
                $scope.currentPlayer = data.currentPlayer;
            });


            $scope.move = function (row, index) {
                turn++;
                $scope.board[row][index] = $scope.currentPlayer;
                var gameStatus = checkGame($scope.board);

                if (gameStatus) {
                    $scope.winner = $scope.currentPlayer;
                    alert($scope.winner + " wins.");
                    return;
                }
                if (turn == 9 && gameStatus == false) {
                    alert("Tied game!");
                    return;
                }

                $scope.currentPlayer = $scope.currentPlayer === 'X' ? 'O' : 'X';

                var socketData = {
                    board: $scope.board,
                    currentPlayer: $scope.currentPlayer,
                    sendBy: $scope.player
                };

                // Init
                //socket.emit('playerMove',socketData);
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