//Define variables
var userWins = 0;
var compWins = 0;
var numTies = 0;

var totalMoves = 0;
var gameOver = false;

var userTurn = "X";
var compTurn = "O";

var curTurn = "X";

var winningMoves = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
];

var emptyTiles = [1, 2, 3, 4, 5, 6, 7, 8, 9];

//Important functions
function setElementText(id, text) {
    document.getElementById(String(id)).innerText = text;
}

function getElementText(id) {
    return document.getElementById(String(id)).innerText;
}

function setElementBackgroundColor(id, col) {
    document.getElementById(String(id)).style.backgroundColor = col;
}

//Game mechanics
function startGame() {
    totalMoves = 0;
    gameOver = false;

    curTurn = "X";

    emptyTiles = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    setElementText("userWins", "Your Wins: " + String(userWins) + " | Computer Wins: " + String(compWins) + " | Ties: " + String(numTies));

    for (var i = 1; i <= 9; i++) {
        setElementText("tile" + String(i), "");
        setElementBackgroundColor("tile" + String(i), "white");
    }
}

function makeMove(tile, player) {
    if (gameOver == false) {
        var turnCheck;

        if (player == "user") {
            turnCheck = userTurn;
        } else {
            turnCheck = compTurn;
        }

        if (curTurn == turnCheck) {
            var tileID = "tile" + String(tile);

            if (getElementText(tileID) == "") {
                setElementText(tileID, curTurn);

                emptyTiles.splice(emptyTiles.indexOf(tile), 1);

                switchTurn(tile);
            }
        }
    }
}

function switchTurn(userMove) {
    totalMoves = totalMoves + 1;

    var winner = checkWin();

    if (winner != false) {
        if (winner == userTurn) {
            userWins = userWins + 1;
        } else if (winner == compTurn) {
            compWins = compWins + 1;
        } else {
            numTies = numTies + 1;
        }

        setElementText("userWins", "Your Wins: " + String(userWins) + " | Computer Wins: " + String(compWins) + " | Ties: " + String(numTies));

        setTimeout(function() { startGame(); }, 2000);

        gameOver = true;
    } else {
        if (curTurn == "X") {
            curTurn = "O";
        } else {
            curTurn = "X";
        }

        if (curTurn == compTurn) {
            setTimeout(function() { compMove(userMove); }, 500);
        }
    }
}

function checkWin() {
    var result = false;
    var win = false;

    var tile1;
    var tile2;
    var tile3;

    for (var i = 0; i < winningMoves.length; i++) {
        tile1 = "tile" + String(winningMoves[i][0]);
        tile2 = "tile" + String(winningMoves[i][1]);
        tile3 = "tile" + String(winningMoves[i][2]);

        if (getElementText(tile1) == getElementText(tile2) && getElementText(tile1) == getElementText(tile3) && getElementText(tile1) != "") {
            win = true;

            break;
        }
    }

    if (win == true) {
        result = getElementText(tile1);

        setElementBackgroundColor(tile1, "#2ecc71");
        setElementBackgroundColor(tile2, "#2ecc71");
        setElementBackgroundColor(tile3, "#2ecc71");
    }

    if (result == false && emptyTiles.length == 0) {
        result = "tie";
    }

    return result;
}

//"Brain" of the bot
function compMove(userMove) {
    if (totalMoves == 1) {
        if (userMove == 5) {
            counterMiddleAtOne();
        } else {
            moveMiddleAtOne();
        }
    } else if (totalMoves == 3) {
        if (userMove == 1 || userMove == 3 || userMove == 7 || userMove == 9) {
            if (userAdjacentPattern(userMove)) {
                if (getElementText("tile5") == compTurn) {
                    counterAdjacentPattern();
                } else {
                    makeBasicMove();
                }
            } else if (userDiagonalPattern(userMove)) {
                if (getElementText("tile5") == userTurn) {
                    counterDiagonalPattern(userMove);
                } else {
                    makeBasicMove();
                }
            } else if (counterNyla() != false) {
                counterNyla();
            } else {
                makeBasicMove();
            }
        } else {
            if (counterCornerPattern() != false) {
                counterCornerPattern();
            } else {
                makeBasicMove();
            }
        }
    } else if (totalMoves > 3 && totalMoves % 2 == 1) {
        if (makeWinningMove() != false) {
            makeWinningMove();
        } else if (makeBlockingMove() != false) {
            makeBlockingMove();
        } else if (counterCornerPattern() != false) {
            counterCornerPattern();
        } else {
            makeBasicMove();
        }
    }
}

//-Basic moves
function makeBasicMove() {
    if (makeWinningMove() != false) {
        makeWinningMove();
    } else {
        if (makeBlockingMove() != false) {
            makeBlockingMove();
        } else {
            makeRandomMove();
        }
    }
}

function makeWinningMove() {
    var move = false;

    for (var i = 0; i < winningMoves.length; i++) {
        if (getElementText("tile" + String(winningMoves[i][0])) == compTurn && getElementText("tile" + String(winningMoves[i][1])) == compTurn) {
            if (getElementText("tile" + String(winningMoves[i][2])) == "") {
                move = winningMoves[i][2];
            }
        } else if (getElementText("tile" + String(winningMoves[i][1])) == compTurn && getElementText("tile" + String(winningMoves[i][2])) == compTurn) {
            if (getElementText("tile" + String(winningMoves[i][0])) == "") {
                move = winningMoves[i][0];
            }
        } else if (getElementText("tile" + String(winningMoves[i][0])) == compTurn && getElementText("tile" + String(winningMoves[i][2])) == compTurn) {
            if (getElementText("tile" + String(winningMoves[i][1])) == "") {
                move = winningMoves[i][1];
            }
        }
    }

    if (move != false) {
        if (getElementText("tile" + String(move)) != "") {
            move = false;
        }
    }

    if (move != false) {
        makeMove(move, "comp");
    }

    return move;
}

function makeBlockingMove() {
    var move = false;

    for (var i = 0; i < winningMoves.length; i++) {
        if (getElementText("tile" + String(winningMoves[i][0])) == userTurn && getElementText("tile" + String(winningMoves[i][1])) == userTurn) {
            if (getElementText("tile" + String(winningMoves[i][2])) == "") {
                move = winningMoves[i][2];
            }
        } else if (getElementText("tile" + String(winningMoves[i][1])) == userTurn && getElementText("tile" + String(winningMoves[i][2])) == userTurn) {
            if (getElementText("tile" + String(winningMoves[i][0])) == "") {
                move = winningMoves[i][0];
            }
        } else if (getElementText("tile" + String(winningMoves[i][0])) == userTurn && getElementText("tile" + String(winningMoves[i][2])) == userTurn) {
            if (getElementText("tile" + String(winningMoves[i][1])) == "") {
                move = winningMoves[i][1];
            }
        }
    }

    if (move != false) {
        if (getElementText("tile" + String(move)) != "") {
            move = false;
        }
    }

    if (move != false) {
        makeMove(move, "comp");
    }

    return move;
}

function makeRandomMove() {
    var move = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

    if (getElementText("tile" + String(move)) == "") {
        makeMove(move, "comp");
    } else {
        makeRandomMove();
    }
}

//-Counter attacks
function counterMiddleAtOne() {
    var possibleMoves = [1, 3, 7, 9];

    var move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

    makeMove(move, "comp");
}

function moveMiddleAtOne() {
    makeMove(5, "comp");
}

function counterAdjacentPattern() {
    var possibleMoves = [2, 4, 6, 8];

    var move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

    if (getElementText("tile" + String(move)) == "") {
        makeMove(move, "comp");
    } else {
        makeBasicMove();
    }
}

function counterDiagonalPattern(tile) {
    var possibleMoves;

    if (tile == 1 || tile == 9) {
        possibleMoves = [3, 7];
    } else if (tile == 3 || tile == 7) {
        possibleMoves = [1, 9];
    }

    var move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

    if (getElementText("tile" + String(move)) == "") {
        makeMove(move, "comp");
    } else {
        makeBasicMove();
    }
}

function counterNyla() {
    var move = false;

    if (getElementText("tile2") == "X" && getElementText("tile7") == "X" || getElementText("tile8") == "X" && getElementText("tile1") == "X") {
        move = 4;
    } else if (getElementText("tile2") == "X" && getElementText("tile9") == "X" || getElementText("tile8") == "X" && getElementText("tile3") == "X") {
        move = 6;
    } else if (getElementText("tile6") == "X" && getElementText("tile1") == "X" || getElementText("tile4") == "X" && getElementText("tile3") == "X") {
        move = 2;
    } else if (getElementText("tile6") == "X" && getElementText("tile7") == "X" || getElementText("tile4") == "X" && getElementText("tile9") == "X") {
        move = 8;
    }

    if (move != false) {
        makeMove(move, "comp");
    }

    return move;
}

function counterCornerPattern() {
    var move = false;

    if (getElementText("tile2") == "X" && getElementText("tile4") == "X") {
        if (getElementText("tile1") == "") {
            move = 1;
        }
    } else if (getElementText("tile2") && getElementText("tile6") == "X") {
        if (getElementText("tile3") == "") {
            move = 3;
        }
    } else if (getElementText("tile4") && getElementText("tile8") == "X") {
        if (getElementText("tile7") == "") {
            move = 7;
        }
    } else if (getElementText("tile6") && getElementText("tile8") == "X") {
        if (getElementText("tile9") == "") {
            move = 9;
        }
    }

    if (move != false) {
        makeMove(tile, "comp");
    }

    return move;
}

//-User strategy detection
function userAdjacentPattern(tile) {
    var diagonalPattern = false;

    if (tile == 1) {
        if (getElementText("tile9") == userTurn) {
            diagonalPattern = true;
        }
    } else if (tile == 9) {
        if (getElementText("tile1") == userTurn) {
            diagonalPattern = true;
        }
    } else if (tile == 3) {
        if (getElementText("tile7") == userTurn) {
            diagonalPattern = true;
        }
    } else if (tile == 7) {
        if (getElementText("tile3") == userTurn) {
            diagonalPattern = true;
        }
    }

    return diagonalPattern;
}

function userDiagonalPattern(tile) {
    var diagonalPattern = false;

    if (tile == 1) {
        if (getElementText("tile9") == "O") {
            diagonalPattern = true;
        }
    } else if (tile == 9) {
        if (getElementText("tile1") == "O") {
            diagonalPattern = true;
        }
    } else if (tile == 3) {
        if (getElementText("tile7") == "O") {
            diagonalPattern = true;
        }
    } else if (tile == 7) {
        if (getElementText("tile3") == "O") {
            diagonalPattern = true;
        }
    }

    return diagonalPattern;
}
