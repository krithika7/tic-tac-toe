var _ = require('underscore');
var p1 = null,
    p2 = null,
    symbol = {},
    moves = {},
    current = null,
    win = false,
    draw = false,
    players = 0,
    cells = [false, false, false, false, false, false, false, false, false],
    combinations = [
        [1,2,3],
        [4,5,6],
        [7,8,9],
        [1,4,7],
        [2,5,8],
        [3,6,9],
        [1,5,9],
        [3,5,7]
    ],
    winner = null;

exports.resetGame = function(){
    p1 = null;
    p2 = null;
    symbol = {};
    moves = {};
    current = null;
    win = false;
    draw = false;
    players = 0;
}

exports.login = function(msgArray){
    player = msgArray[0];
    if(!p1){
        p1 = player;
        symbol[p1] = 'x';
        moves[p1] = [];
        players++;
    }else{
        p2 = player;
        symbol[p2] = 'o';
        moves[p2] = [];
        current = p2;
        players++;
    }
}


exports.isOnlyPlayer = function(){
    if(players === 1){
        return true;
    }
    return false;
}

exports.isDraw = function(){
    draw = _.reduce(cells, function(memo, c){
        return memo & c;
    });
    if(draw & !win){
        return draw;
    }
}

exports.isWin = function(){
    return win;
}

exports.getSymbol = function(player){
    return symbol[player];
}

exports.addMove = function(player, cell){
    moves[player].push(parseInt(cell));
    cells[parseInt(cell)-1] = true;
    current = player;

    var pMoves = moves[player];
    pMoves.sort();

    combinations.forEach(function(combo){
        var int = _.intersection(pMoves, combo);
        if(_.isEqual(int, combo)){
            win = true;
            winner = player;
        }
    });
};

exports.isFree = function(cell){
    return !cells[parseInt(cell)-1];
}

exports.isTurn = function(player){
    return current == player ? false : true;
}

exports.getWinner = function(){
    return winner;
}
