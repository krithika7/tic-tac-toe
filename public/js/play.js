var username = null;
var tries = 1;
var connection;
var messages;

window.addEventListener("load", function(){
    getUsername();
    messages = document.getElementById("messages");
    document.getElementById("data").setAttribute("data-username", username);

    connection = new WebSocket("ws://localhost:8081");
    connection.onopen = function(){
        login();
    };
    connection.onmessage = function(event){
        var event = event.data.split(':');
        switch(event[0]){
            case 'msg':
                displayMessage(event);
                break;

            case 'display':
                displayMove(event);
                break;

            case 'start':
                console.log('start game', event);
                startGame(event);
                break;

            case 'end':
                endGame(event);
                break
        }
    };
    connection.onclose = function(){
        connection.send("logout:" + username);
    };
    connection.onerror = function(){
        connection.send("error");
    };

});

function getUsername(){
    while(!username){
        if(tries == 1){
            username = prompt("Enter a username to start playing");
            tries++;
        }else{
            username = prompt("You must enter a username to start playing");
        }
    }
}

function displayMessage(message){
    var text = document.createTextNode(message[1]);
    var br = document.createElement("br");
    messages.insertBefore(br, messages.firstChild);
    messages.insertBefore(text, messages.firstChild);
}

function displayMove(message){
    var username = message[1];
    var cell = message[2];
    var symbol = message[3];

    var img = document.createElement("img");
    img.src = "/img/" + symbol + ".png";
    document.getElementById(cell).appendChild(img);
}

function startGame(message){
    displayMessage(message);
    init();
}

function endGame(message){
    displayMessage(message);
    deinit();
}

function init(){
    var td = document.getElementsByTagName("td");
    for(var i=0; i<td.length; i++){
        td[i].addEventListener("click", play);
    }
}

function deinit(){
    var td = document.getElementsByTagName("td");
    for(var i=0; i<td.length; i++){
        td[i].addEventListener("click", null);
    }
}
function login(){
    connection.send("login:" + document.getElementById("data").getAttribute("data-username"));
}

function play(){
    var cell = this.id;
    console.log(username, cell);
    connection.send("play:" + username + ":" + cell );
}
