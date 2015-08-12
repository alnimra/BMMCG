/**
 * Created by ipsum on 8/10/15.
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var boxes = [];
var ids = {};

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/'));

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('init box', function (boxy) {
        ids['user ' + socket.id] = boxy;
        boxes.push(boxy);
        console.log(boxes);

        io.emit('add box', boxes);
    });


    socket.on('∆', function (box) {
        for (var i in boxes) {
            if (boxes[i].name == box.name) {
                boxes[i] = box;

            }
        }
        if(boxes.length == 2){
            if((boxes[0].x <= boxes[1].x + boxes[1].width && boxes[0].y <= boxes[1].y + boxes[1].height)
                && boxes[0].x + boxes[0].width >= boxes[1].x && boxes[0].y + boxes[0].height >= boxes[1].y){

                console.log('COLLIDE!!!');
                io.emit('collide');
            }
        }


        socket.broadcast.emit('∆', box);
    });

    socket.on('disconnect', function () {
        io.emit('destroy box', ids['user ' + socket.id]);
        for (var i in boxes) {
            if (boxes[i].name == ids['user ' + socket.id].name) {
                boxes.splice(i, 1);
                console.log('the job has been done...')
            }
        }
        console.log('user disconnected');
    });

});

http.listen(3000, function () {
    console.log('listening on *:3000');
});

