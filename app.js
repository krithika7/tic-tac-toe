var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    exphbs = require('express-handlebars'),
    hbs = exphbs.create({
        defaultLayout: 'main'
    }),
    ws = require('nodejs-websocket'),
    _ = require('underscore'),
    util = require('util'),
    game = require('./game');

app.use(bodyParser.json());
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

// app ui listening on 8080
// app route
app.get('/', function(req, res){
    return res.render('enter');
});
app.listen(8080, function(){
    console.log('Starting tic tac toe ui on port 8080...');
});

// app websocket listening on 8081
// message and events exchange
var server = ws.createServer(function(connection){
	connection.on('text', function(message) {
        var type = message.split(':')[0];
        message = message.split(':');
        message.shift();

        switch(type){
            case 'login' :
                login(connection, message);
                break;
            case 'play' :
                play(connection, message);
                break;
        }

    });
    connection.on('close', function(){
        console.log('closed');
    });

}).listen(8081, function(){
    console.log('Starting websocket on port 8081...');
});


function respond(connection, message){
    connection.sendText(message);
}

function broadcast(connection, message){
    server.connections.forEach(function (connection) {
		connection.sendText(message);
	});
}


// respond to or broadcast events to client
function login(connection, msgArray){
    game.login(msgArray);
    if(game.isOnlyPlayer()){
        respond(connection, msg('waiting for another player'));
    }else{
        broadcast(connection, start('both players logged in'));
        broadcast(connection, msg('begin playing'));
    }
}

function play(connection, msgArray){
    var player = msgArray[0];
    var cell = msgArray[1];
    if(!game.isTurn(player)){
        respond(connection, msg('Not your turn'));
    }else if(!game.isFree(cell)){
        respond(connection, msg('Cell occupied'));
    }else if(game.isWin()){
        broadcast(connection, end(util.format('Game Over! %s won! Refresh to start again!', game.getWinner())));
    }else if(game.isDraw()){
        broadcast(connection, msg('Game Draw!'));
    }else{
        var symbol = game.getSymbol(player);
        msgArray.push(symbol);
        broadcast(connection, display(msgArray));
        game.addMove(player, cell);
        if(game.isWin()){
            broadcast(connection, msg('Game Won! Refresh to start again!'));
        }
    }
}

// events messages to client
function msg(msg){
    return util.format('msg:%s',msg);
}

function display(msgArray){
    if(msgArray[0] !== 'display'){
        msgArray.unshift('display');
    }
    return msgArray.join(':');
}

function start(msg){
    return util.format('start:%s', msg);
}

function end(msg){
    return util.format('end:%s', msg);
}
