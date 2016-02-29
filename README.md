# CLASSIC TIC TAC TOE GAME

The tic tac toe game consists of a classic 3x3 grid where two players take turns to mark 'x' and 'o' in the grid.
The first player to get 3 of a kind in a row wins the game.

This implementation of tic tac toe has two main servers. One is a http server that servers the UI of the app.
The other is a websocket server that allows broadcasting of messages between the two players.

## Logic
In a 3x3 tic tac toe, there are 8 possible winning combinations. If either player has one of the 8 combinations she wins.
At every play, the game logic checks to see if the move makes a win, a finished game or draw.

## Overview
### HTTP at port 8080
The HTTP server is listening on port 8080. It has one endpoint:

```
GET http://localhost:8080/
```

The response is a HTML page that consists of an empty 3x3 grid and a message display.

### Websocket at port 8081
The websocket is listening for messages being passed by either players to be communicated to all players. This is similar to a chat scenario.
The websocket server has one endpoint:

```
ws://localhost:8081
```

All text being passed to the websocket follows the following protocol:

```
[action][colon][message field 1][colon][message field 2] : ..
```

For example: If player1 wants to play on cell 3

```
play:player1:3
```

These are the actions with which the client can communicate to the server:
* 'login' : A player has logged in to the app by calling the GET endpoint and entering a username.
* 'play' : A player has made a move.

These are the actions with which the server communicates to all clients or to the current client only:
* 'msg' : Server sends a message which shows up as the most recent message received.
* 'display' : Server broadcasts for the UI to update the grid with the most recent move.
* 'start' : Server signals that the game can start. This essentially initialized the onclick of the grid to allow sending 'play' actions.
* 'end' : Server signals that the game is over and all onclicks of the grid must be disabled.

### Timing diagram
See `tic_tac_toe_flow.pdf`

## Running instructions
* To install all node module dependencies `npm install`
* To start `npm start`

### Improvements and can-be-fixed's
* Can improve refresh game. Right now, the app server needs to be killed `^C` and restarted `npm start`
* Refresh game can be done by calling the resetGame() method while listening for a 'refresh' action on the websocket
* Can implement: open window open to be a spectator to the game
* Entering the same username at the beginning of the game for both players might break things. That can be fixed by a simple check
