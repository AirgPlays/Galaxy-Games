
var playerOne; // player 1 aka the shaqtus
//var shaq; // img to hold the shaqtus

var ball;
var ballImg;

var playerTwo;

function startGame() {
    myGameArea.start();
    playerOne = new player(30, 30, "shaqtus", 10, 400);
    console.log(playerOne.x);
    
    playerTwo = new player(30, 30, "lebron", 400, 400);
    
//    shaq = document.getElementById("shaqtus");
    ballImg = document.getElementById("balldontlie");
    
    ball = new ball(200, 200);
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 600;
        this.canvas.height = 450;
        this.context = this.canvas.getContext("2d");
        
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        
        this.interval = setInterval(updateGameArea, 20);
       
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown"); 
            // accelerate downwards
//            accelerateP1(.4);
            if (e.keyCode == 38) {
//                playerOne.speedY = -3;
                playerOne.accelerate(0.4);
            }
            else if (e.keyCode == 87)
                playerTwo.accelerate(0.3);
            
        })
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// @TODO Make the ball bounce off the walls

function ball(x, y) {
    
    this.gamearea = myGameArea;
    this.width = 20;
    this.height = 20;
    this.speedX = 0; 
    this.speedY = -4;
    this.x = x;
    this.y = y;
    this.gravity = 0.5;
    this.gravitySpeed = 0;
    
//    this.accelX = 0;
    
    this.bounce = 0.8;

      this.update = function() {
        ctx = myGameArea.context;
        ctx.drawImage(ballImg, this.x, this.y);
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        
        console.log(this.speedY);
        
        // decelerate
        if (this.speedX > 0) {
            this.speedX--;
        }
        else if (this.speedX < 0) {
            this.speedX++;
        }
        
        if (this.speedY > 0) {
            this.speedY--;
        }
        else if (this.speedY < 0) {
            this.speedY++;
        }
        
        
//        console.log(this.speedY);
        
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        
        this.hitBottom();
        this.hitTop();
//        console.log(this.x + ", " + this.y);
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - 3 * this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
        }
        
    }
    this.hitTop = function() {
        var top = 5;
        if (this.y < top) {
            this.y = top;
//            ball.speedY = -1 * ball.speedY; // speed is 0 when it reaches top
            ball.speedY = 10;
//            accelerateBall(10);
        }
    }
    
}

function accelerateBall(n) {
    ball.gravity = n;
}

function player(width, height, name, x, y) {
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0; // what the fork is this shit    
    this.x = x;
    this.y = y;   
    this.gravity = 0.05;
    this.gravitySpeed = 0;
    
    var img = document.getElementById(name);
    
    this.update = function() {
        ctx = myGameArea.context;
        ctx.drawImage(img, this.x, this.y);
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed; 
        this.hitBottom();
        this.hitTop();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - 2 * this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
        
    }
    this.hitTop = function() {
        var top = 5;
        if (this.y < top) {
            this.y = top;
        }
    }
    this.accelerate = function(n) {
        this.gravity = n;   
    }
}


// check if either player hit ball
// if so, move ball
function ballCollision() {
//    
//    var p1Left = playerOne.x;
//    var p1Right = playerOne.x + playerOne.width;
//    var p1Top = playerOne.y;
//    var p1Bottom = playerOne.y + playerOne.height;
//    
////    console.log(p1Left + " " + p1Right);
//    
//    var p2Left = playerTwo.x;
//    var p2Right = playerTwo.x + playerTwo.width;
//    var p2Top = playerTwo.y;
//    var p2Bottom = playerTwo.y + playerTwo.height;
//    
//    var ballLeft = ball.x;
//    var ballRight = ball.x + ball.width;
//    var ballTop = ball.y;
//    var ballBottom = ball.y + ball.height;
//    
    // playerOne collide with ball
    if (RectCircleColliding(ball, playerOne)) {
        console.log("p1 hit ball");   
        
        // send the ball left and right accordingly
        if (playerOne.speedX > 0)
            ball.speedX = playerOne.speedX + 2;
        
        else
            ball.speedX = playerOne.speedX - 2;
        
        // move ball up and down
        if (playerOne.speedY < 0) 
            ball.speedY = -20;
        
//        else 
//            ball.s
        
    }
    
    // player 2 and ball
    if (RectCircleColliding(ball, playerTwo)) {
        console.log("p2 hit ball");   
        
        // send the ball left and right accordingly
        if (playerTwo.speedX > 0) {
            ball.x += 5;
            ball.speedX = playerTwo.speedX + 2;
        }
        
        else {
            ball.x -= 5;
            ball.speedX = playerTwo.speedX - 2;
        }
        
        // move ball up and down
        if (playerTwo.speedY < 0) 
            ball.speedY = -20;
        
//        else 
//            ball.s
        
    }
    
    
    
//    console.log(playerOne.speedY);
             
}


 function RectCircleColliding(circle,rect){
        var distX = Math.abs(circle.x - rect.x-rect.width/2);
        var distY = Math.abs(circle.y - rect.y-rect.height/2);

        if (distX > (rect.width/2 + circle.width)) { return false; }
        if (distY > (rect.height/2 + circle.height)) { return false; }

        if (distX <= (rect.width/2)) { return true; } 
        if (distY <= (rect.height/2)) { return true; }

        var dx = distX-rect.width/2;
        var dy = distY-rect.height/2;
        return (dx*dx+dy*dy <= (circle.height*circle.height));
}

function updateGameArea() {
    myGameArea.clear();
    
    // otherwise they would constantly move
    // this requires key to be held for them to move
    playerOne.speedX = 0;
    playerOne.speedY = 0;  
    
    playerTwo.speedX = 0;
    playerTwo.speedY = 0;
    
    
    // player 1 is controlled by arrows
    if (myGameArea.keys && myGameArea.keys[37]) {playerOne.speedX = -10; }
    if (myGameArea.keys && myGameArea.keys[39]) {playerOne.speedX = 10; }
    if (myGameArea.keys && myGameArea.keys[38]) {
//        playerOne.accelerate(-.85); 
        playerOne.speedY = -20;
    }

    // player 2 is controlled by w, a, d
    if (myGameArea.keys && myGameArea.keys[87]) {playerTwo.speedY = -20;}
    if (myGameArea.keys && myGameArea.keys[65]) {playerTwo.speedX = -10;}
    if (myGameArea.keys && myGameArea.keys[68]) {playerTwo.speedX = 10;}
    
    playerOne.newPos();    
    playerOne.update();
    
    playerTwo.newPos();
    playerTwo.update();
    
    ball.newPos();
    ball.update();
    
    ballCollision();
    
}