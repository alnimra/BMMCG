var socket = io();

var canvas = document.getElementById('main'),
    ctx = canvas.getContext('2d');


canvas.width = window.outerWidth;
canvas.height = window.outerHeight;

/** KEY HANDLING************************************************************/
var keys = {};
window.addEventListener('keydown', function (e) {
    console.log('keyDown');

    keys[e.keyCode] = true;
    e.preventDefault();
});
window.addEventListener('keyup', function (e) {
    console.log('keyUp');
    delete keys[e.keyCode];
});

/** BOX HANDLING************************************************************/
//Box Object
var player = null;
function randColor() {
    var rand = Math.floor(Math.random() * 999);
    if (rand % 10 == 0) {
        return 'orange';
    } else if (rand % 9 == 0) {
        return 'blue';
    } else if (rand % 4 == 0) {
        return 'red';
    } else {
        return 'green';
    }
}
function Box(options) {
    this.name = options.name;
    this.color = options.color || randColor();
    this.x = options.x || 10;
    this.y = options.y || 10;
    this.prevx = options.x;
    this.prevy = options.y;
    this.width = options.width || 32;
    this.height = options.height || 32;
    this.speed = options.speed || 10;
}

//Create New Box
function newBox() {
    var rand = Math.floor(Math.random() * 999);
    var boxy = new Box({
        name: 'boxy ' + rand,
        x: 10,
        y: 10,
        width: 3,
        height:3,
        speed: 10
    });
    if (boxy.color == 'orange') {
        boxy.speed = 5;
    } else if (boxy.color == 'blue') {
        boxy.speed = 5;
    } else if (boxy.color == 'red') {
        boxy.speed = 5;
    } else {
        boxy.speed = 5;
    }
    socket.emit('init box', boxy);
    player = boxy;
}

/*function getX(box){
 return box.x;
 }

 function getY(box){
 return box.y;
 }*/

function destroyBox(box) {
    ctx.clearRect(box.x, box.y, box.width, box.height);

    //socket.emit('∆', box);
    console.log('destroyed ' + box);
}

function drawBox(box) {
    ctx.fillStyle = box.color;
    ctx.fillRect(box.x, box.y, box.width, box.height);
}

function boxMotion(box) {
    if (65 in keys || 68 in keys || 87 in keys || 83 in keys || 38 in keys || 37 in keys || 40 in keys || 39 in keys) {
        ctx.clearRect(box.x, box.y, box.width, box.height);
        box.prevx = box.x;
        box.prevy = box.y;
        if (65 in keys || 37 in keys) {
            box.x -= box.speed;
        } else if (68 in keys || 39 in keys) {
            box.x += box.speed;
        } else if (87 in keys || 38 in keys) {
            box.y -= box.speed;
        } else if (83 in keys || 40 in keys) {
            box.y += box.speed;
        }
        socket.emit('∆', box);

        drawBox(box);
    } else {
        drawBox(box);
    }
}

socket.on('add box', function (boxes) {
    for (var i in boxes) {
        if (boxes[i].name != player.name) {
            drawBox(boxes[i]);
        }
    }
});

socket.on('∆', function (box) {
    ctx.clearRect(box.prevx, box.prevy, box.width, box.height);
    drawBox(box);
});

socket.on('collide', function () {
    ctx.fillStyle = 'red';
    ctx.font = '30px Arial';
    ctx.fillText('COLLIDED!!!', 0, 30);
    setTimeout(function () {
        ctx.clearRect(0, 0, canvas.width, 35);
    }, 5000)
});

socket.on('destroy box', function (box) {
    destroyBox(box);
});

newBox();
setInterval(function () {
    boxMotion(player);
}, 5);