var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

var socket = require('socket.io');
var io = socket(server);

var dateUtiles = require('date-utils');

var path = require('path');

var fs = require('fs'); // mp4 file read 

var port = 5000;
var socketList = [];

/* porst 5000 접속시 Main Page(chat.html)로 이동 */
app.get('/',function (req, res) {
  res.sendFile(__dirname+'/views/chat.html');
});


// 새로운 사용자 접속시 실행
io.on('connection', function(socket) {
    
    socketList.push(socket);
    console.log("새로운 사용자가 접속하였습니다!");

    // canvas가 입력 되었을 경우 실행
    socket.on('canvasSend', function(msgText,color,width) {
        // 접속한 사용자 화면에 표출
        socketList.forEach(function(item, i) {
            if (item != socket) {
                item.emit('canvasSend', msgText, color, width);
            }
         });
         
    });

    // canvas 화면 초기화 실행
    socket.on('canvasClear', function() {
        socketList.forEach(function(item, i) {
            if (item != socket) {
                item.emit('canvasClear');
            }
        });
    });
 
    // 접속 종료시 실행
    socket.on('disconnect', function() {
        socketList.splice(socketList.indexOf(socket), 1);
    });

});

server.listen(port,function () {
    console.log('Server On!');
});

app.use(express.static(path.join(__dirname,'public')));
