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
function Box(options) {
    this.name = options.name;
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
        width: 16,
        height: 16,
        speed: 5
    });
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
    ctx.fillStyle = 'white';
    ctx.fillRect(box.x, box.y, box.width, box.height);
}

function boxMotion(box) {
    if (65 in keys || 68 in keys || 87 in keys || 83 in keys) {
        ctx.clearRect(box.x, box.y, box.width, box.height);
        box.prevx = box.x;
        box.prevy = box.y;
        if (65 in keys) {
            box.x -= box.speed;
        } else if (68 in keys) {
            box.x += box.speed;
        } else if (87 in keys) {
            box.y -= box.speed;
        } else if (83 in keys) {
            box.y += box.speed;
        }
        socket.emit('∆', box);

        drawBox(box);
    } else {
        drawBox(box);
    }
}

socket.on('add box', function(boxes){
   for(var i in boxes){
       if(boxes[i].name != player.name){
           drawBox(boxes[i]);
       }
   }
});

socket.on('∆', function (box) {
    ctx.clearRect(box.prevx, box.prevy, box.width, box.height);
    drawBox(box);
});

socket.on('destroy box', function (box) {
    destroyBox(box);
});

newBox();
setInterval(function(){
    boxMotion(player);
}, 30);