/* eslint-disable max-classes-per-file */
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const paddleHeight = 10;
const paddleWidth = 75;
const brickRowCount = 5;
const brickColumnCount = 3;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const ballRadius = 10;
const objcolor = '#0095DD';
const paddleXStart = (canvas.width - paddleWidth) / 2;

class Ball {
  constructor(x = 0, y = 0, radius = 10, color = '#0095DD') {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = 2;
    this.dy = -2;
    this.color = color;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  render(ctx) { // Overrides the existing render method!
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

let ball = new Ball();

let paddleX;

resetBallandPaddle();

let rightPressed = false;
let leftPressed = false;

let score = 0;

let lives = 3;

const bricks = [];

makeBricks();

class Bricks {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function makeBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r += 1) {
      const x = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
      const y = (c * (brickHeight + brickPadding)) + brickOffsetTop;
      bricks[c][r] = { x, y, status: 1 };
    }
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLef') {
    leftPressed = false;
  }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = objcolor;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = objcolor;
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      if (bricks[c][r].status === 1) {
        const { x, y } = bricks[c][r];
        ctx.beginPath();
        ctx.rect(x, y, brickWidth, brickHeight);
        ctx.fillStyle = objcolor;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        // eslint-disable-next-line max-len
        if (ball.x > brick.x && ball.x < brick.x + brickWidth && ball.y > brick.y && ball.y < brick.y + brickHeight) {
          ball.dy = -ball.dy;
          brick.status = 0;
          score += 1;
          if (score === brickRowCount * brickColumnCount) {
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = objcolor;
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = objcolor;
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function resetBallandPaddle() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 30;
  ball.dx = 3;
  ball.dy = -3;
  paddleX = paddleXStart;
}

function arrowKeyChecker() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}

function gameLogic() {
  if (ball.x + ball.dx > canvas.width - ballRadius || ball.x + ball.dx < ballRadius) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy < ballRadius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ballRadius) {
    if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
      ball.dy = -ball.dy;
    } else {
      lives -= 1;
      if (!lives) {
        document.location.reload();
      } else {
        resetBallandPaddle();
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  moveBall();
  arrowKeyChecker();
  gameLogic();

  requestAnimationFrame(draw);
}

draw();
