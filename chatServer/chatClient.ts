import io2 = require("socket.io");

// import * as so from 'socket.io';
// var t1 = socketIO();
// io2.listen()

var messagesElement = document.getElementById('messages');
var lastMessageElement = null;
function addMessage(message) {
    var newMessageElement = document.createElement('div');
    var newMessageText = document.createTextNode(message);
    newMessageElement.appendChild(newMessageText);
    messagesElement.insertBefore(newMessageElement, lastMessageElement);
    lastMessageElement = newMessageElement;
}

var socket = io.connect('http://localhost:4000');
socket.on('serverMessage', function(content) {
    addMessage(content);
});

socket.on('login', function(){
    console.log('received login...');
    var username = prompt('Enter your name:');
    socket.emit('login', username);
});

var inputElement = document.getElementById('input');
inputElement.onkeydown = function(keyboardEvent) {
    if (keyboardEvent.keyCode === 13) {
        socket.emit('clientMessage', inputElement.value);
        inputElement.value = '';
        return false;
    } else {
        return true;
    }
};