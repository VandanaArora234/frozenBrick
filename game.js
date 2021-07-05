const BG_IMG = new Image();
BG_IMG.src = "img/f2.png";

const NORMAL = new Image();
NORMAL.src = "img/normal.png";

const BALL = new Image();
BALL.src = "img/ball.png";

const FIRE = new Image();
FIRE.src = "img/fire.png";

const LEVEL_IMG = new Image();
LEVEL_IMG.src = "img/level.png";

const LIFE_IMG = new Image();
LIFE_IMG.src = "img/life.png";

const SCORE_IMG = new Image();
SCORE_IMG.src = "img/score.png";

const PLATE_IMG = new Image();
PLATE_IMG.src = "img/block.png";


/////// END LOAD IMAGES ////////

// ************************ //

/////// LOAD SOUNDS ////////

const WALL_HIT = new Audio();
WALL_HIT.src = "sounds/wall.mp3";

const LIFE_LOST = new Audio();
LIFE_LOST.src = "sounds/life_lost.mp3";

const PADDLE_HIT = new Audio();
PADDLE_HIT.src = "sounds/paddle_hit.mp3";

const WIN = new Audio();
WIN.src = "sounds/win.mp3";

const BRICK_HIT = new Audio();
BRICK_HIT.src = "sounds/brick_hit.mp3";


var startSound1 = document.querySelector('#start2');

window.onload = ()=> {
    console.log(1);
    startSound1.currentTime = 0;
    startSound1.play();
    startSound1.muted = false;
};


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
var ini=4.5;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.querySelector('#pause').addEventListener('click', ()=> {
    alert("hello");
});

// SELECT CANVAS ELEMENT
const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");

// ADD BORDER TO CANVAS
cvs.style.border = "5px solid #0ff";

// MAKE LINE THIK WHEN DRAWING TO CANVAS
ctx.lineWidth = 3;

// GAME VARIABLES AND CONSTANTS
const PADDLE_WIDTH = 150;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 12;
let LIFE =2; // PLAYER HAS 3 LIVES
let SCORE = 0;
const SCORE_UNIT = 10;
let LEVEL = 1;
const MAX_LEVEL = 5;
let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;

// CREATE THE PADDLE
const paddle = {
    x : cvs.width/2 - PADDLE_WIDTH/2,
    y : cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width : PADDLE_WIDTH,
    height : PADDLE_HEIGHT,
    dx :5
}

// DRAW PADDLE
function drawPaddle(){
    ctx.fillStyle = "#2e3548";
    // ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.drawImage(PLATE_IMG,paddle.x, paddle.y, paddle.width, paddle.height);

    
    // ctx.strokeStyle = "#ffcd05";
    // ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// CONTROL THE PADDLE
document.addEventListener("keydown", function(event){
   if(event.keyCode == 37){
       leftArrow = true;
   }else if(event.keyCode == 39){
       rightArrow = true;
   }
});
document.addEventListener("keyup", function(event){
   if(event.keyCode == 37){
       leftArrow = false;
   }else if(event.keyCode == 39){
       rightArrow = false;
   }
});

// MOVE PADDLE
function movePaddle(){
    if(rightArrow && paddle.x + paddle.width+0 < cvs.width){
        paddle.x += paddle.dx;
    }else if(leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx;
    }
}

// CREATE THE BALL
const ball = {
    x : cvs.width/2,
    y : paddle.y - BALL_RADIUS,
    radius : BALL_RADIUS,
    speed : 4.5,
    dx : 4.5 * (Math.random() * 2 - 1),
    dy : -4.5
}

// DRAW THE BALL
function drawBall(){
    ctx.beginPath();
    
    // ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    // ctx.fillStyle = "#ffcd05";
    ctx.drawImage(BALL,ball.x-15, ball.y-20, ball.radius+20, ball.radius+20);
    // ctx.drawImage(PLATE_IMG,paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fill();
    
    ctx.strokeStyle = "#2e3548";
    ctx.stroke();
    
    ctx.closePath();
}

// MOVE THE BALL
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}

// BALL AND WALL COLLISION DETECTION
function ballWallCollision(){

    
    if(ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0){
        ball.dx = - ball.dx;
        
        WALL_HIT.play();

    }

    
    if(ball.y - ball.radius < 0){
        ball.dy = -ball.dy;
        WALL_HIT.play();
    }
    
    if(ball.y + ball.radius >= cvs.height){
        LIFE--; // LOSE LIFE
        LIFE_LOST.play();
        console.log(1);
        resetBall();
    }
}

// RESET THE BALL
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 6 * (Math.random() * 2 - 1);
    ball.dy = -6;
    paddle.width = 150;
    ini=6;
    
}

// BALL AND PADDLE COLLISION
var prev = 0;
function ballPaddleCollision(){
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y){
        
        // PLAY SOUND
        PADDLE_HIT.play();
        
        // CHECK WHERE THE BALL HIT THE PADDLE
        let collidePoint = ball.x - (paddle.x + paddle.width/2);
        
        // NORMALIZE THE VALUES
        collidePoint = collidePoint / (paddle.width/2);
        
        // CALCULATE THE ANGLE OF THE BALL
        let angle = collidePoint * Math.PI/3;
        if(angle==prev) {
            resetBall();
        }
        prev = angle;
            
            
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}

// CREATE THE BRICKS
const brick = {
    row : 1,
    column : 5,
    width : 80,
    height : 20,
    offSetLeft : 20,
    offSetTop : 20,
    marginTop : 40,
    fillColor : "#c4fff7",
    strokeColor : "#FFF"
}

let bricks = [];


function findMe(arr,x,y) {
    for(let i=0;i<arr.length;i++) {
        if(arr[i][0]==x && arr[i][1]==y)
        {    
            return i;
        }
    }
    return -1;
}

function createBricks(){
    var pairs = [];
    let arr = ['ls','lw','hs','hw'];
    let x = 2*(brick.row);
    let visited = [];
    for(let i=0;i<x;i++) {
        while(true)
        {    
            let x2 = getRandomInt(0,brick.row-1);
            let y2 = getRandomInt(0,brick.column-1);
            if(findMe(visited,x2,y2)==-1)
            {
                visited.push([x2,y2]);
                pairs.push([x2,y2,arr[i%arr.length]]);    
                break;
            }
        }
    }
    
    for(let r = 0; r < brick.row; r++){
        bricks[r] = [];
        for(let c = 0; c < brick.column; c++){
            let index = findMe(visited,r,c);

            bricks[r][c] = {
                x : c * ( brick.offSetLeft + brick.width ) + brick.offSetLeft,
                y : r * ( brick.offSetTop + brick.height ) + brick.offSetTop + brick.marginTop,
                status : true,
                low_speed : false,
                low_width : false,
                high_speed : false,
                low_width : false
            }
            if(index!=-1 && index<pairs.length)
            {
                if(pairs[index][2]=='ls')
                {
                    bricks[r][c].low_speed = true;
                }
                else if(pairs[index][2]=='lw') {
                    bricks[r][c].low_width = true;
                }
                else if(pairs[index][2]=='hs') {
                    bricks[r][c].high_speed = true;
                }
                else if(pairs[index][2]=='hw') {
                    bricks[r][c].high_width = true;
                }
            }
        }
    }
}   

createBricks();

// draw the bricks
function drawBricks(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];

            if(b.status){
                if(b.low_width==true)
                {
                    ctx.drawImage(FIRE, b.x, b.y, brick.width, brick.height);
                    // ctx.fillRect(b.x, b.y, brick.width, brick.height);
                    
                }
                else if(b.low_speed==true) {
                    ctx.fillStyle = 'yellow';
                    ctx.fillRect(b.x, b.y, brick.width, brick.height);
                }
                else if(b.high_speed==true) {
                    ctx.fillStyle = 'green';
                    ctx.fillRect(b.x, b.y, brick.width, brick.height);
                }
                else if(b.high_width==true) {
                    ctx.fillStyle = 'blue';
                    ctx.fillRect(b.x, b.y, brick.width, brick.height);
                }
                else{
                    ctx.fillStyle = brick.fillColor;
                    ctx.fillRect(b.x, b.y, brick.width, brick.height);
                }
                
                
                
                // ctx.strokeStyle = brick.strokeColor;
                // ctx.strokeRect(b.x, b.y, brick.width, brick.height);
                
            }
            
        }
    }
}

var k = 1.5;

// ball brick collision
function ballBrickCollision(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            // if the brick isn't broken
            if(b.status){
                if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height){
                    BRICK_HIT.play();
                    ball.dy = - ball.dy;
                    b.status = false; // the brick is broken
                    SCORE += SCORE_UNIT;
                    if(b.low_width==true)
                    {
                        paddle.width-=30;
                        if(paddle.width<20)
                            paddle.width = 20;
                        document.querySelector('body').style.backgroundColor = 'red';
                    }
                    if(b.high_speed==true) {

                        ini+=k
                        ball.dx = ini * (Math.random() * 2 - 1);
                        ball.dy = ini;
                        ball.speed = ini;
                        document.querySelector('body').style.backgroundColor = 'blue';
                    }
                    if(b.low_speed==true)
                    {
                        ini-=k;
                        ini=Math.max(1,ini);
                        ball.dx = ini * (Math.random() * 2 - 1);
                        ball.dy = ini;
                        ball.speed = ini;
                        setTimeout(() => {
                            ini+=k;
                            ini=Math.max(1,ini);
                            // ball.dx = ini * (Math.random() * 2 - 1);
                            // ball.dy = ini;
                            ball.speed = ini;
                        },5000);
                        document.querySelector('body').style.backgroundColor = 'yellow';
                    }
                    if(b.high_width == true) {
                        paddle.width+=30;
                        if(paddle.width>300)
                            paddle.width = 300;
                        document.querySelector('body').style.backgroundColor = 'green';
                    }
                    // paddle.width-=10;
                    
                }
            }
        }
    }
}

// show game stats
function showGameStats(text, textX, textY, img, imgX, imgY){
    // draw text
    ctx.fillStyle = "#FFF";
    ctx.font = "25px Germania One";
    ctx.fillText(text, textX, textY);
    
    // draw image
    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}

// DRAW FUNCTION
function draw(){
    drawPaddle();
    
    drawBall();
    
    drawBricks();
    
    // SHOW SCORE
    showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
    // SHOW LIVES
    showGameStats(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width-55, 5); 
    // SHOW LEVEL
    showGameStats(LEVEL, cvs.width/2, 25, LEVEL_IMG, cvs.width/2 - 30, 5);
}

// game over
function gameOver(){
    if(LIFE <= 0){
        showYouLose();
        GAME_OVER = true;
    }
}

// level up
function levelUp(){
    let isLevelDone = true;
    
    // check if all the bricks are broken
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            isLevelDone = isLevelDone && ! bricks[r][c].status;
        }
    }
    
    if(isLevelDone){
        WIN.play();
        
        if(LEVEL >= MAX_LEVEL){
            showYouWin();
            GAME_OVER = true;
            return;
        }
        brick.row++;
        createBricks();
        ball.speed += 0.5;
        drawPaddle
        resetBall();
        LEVEL++;
        if(LEVEL%3==0)
        {
            LIFE++;
        }
    }
}

// UPDATE GAME FUNCTION
function update(){
    movePaddle();
    
    moveBall();
    
    ballWallCollision();
    
    ballPaddleCollision();
    
    ballBrickCollision();
    
    gameOver();
    
    levelUp();
}

// GAME LOOP
function loop(){
    // CLEAR THE CANVAS
    ctx.drawImage(BG_IMG, 0, 0);
    
    draw();
    
    update();
    
    if(! GAME_OVER){
        requestAnimationFrame(loop);
    }
}
loop();


// SELECT SOUND ELEMENT
const soundElement  = document.getElementById("sound");

soundElement.addEventListener("click", audioManager);

function audioManager(){
    // CHANGE IMAGE SOUND_ON/OFF
    let imgSrc = soundElement.getAttribute("src");
    let SOUND_IMG = imgSrc == "img/SOUND_ON.png" ? "img/SOUND_OFF.png" : "img/SOUND_ON.png";
    
    soundElement.setAttribute("src", SOUND_IMG);
    
    // MUTE AND UNMUTE SOUNDS
    WALL_HIT.muted = WALL_HIT.muted ? false : true;
    PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
    BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
    WIN.muted = WIN.muted ? false : true;
    LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
}

// SHOW GAME OVER MESSAGE
/* SELECT ELEMENTS */
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

// CLICK ON PLAY AGAIN BUTTON
restart.addEventListener("click", function(){
    location.reload(); // reload the page
})

// SHOW YOU WIN
function showYouWin(){
    gameover.style.display = "block";
    youwon.style.display = "block";
    document.querySelector('#score').innerText = SCORE;
}

// SHOW YOU LOSE
function showYouLose(){
    gameover.style.display = "block";
    youlose.style.display = "block";
    document.querySelector('#score').innerText = SCORE;
}



















