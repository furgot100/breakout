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

class Sprite {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

class Ball extends Sprite {
  constructor(x = 0, y = 0, radius = 10, color = '#0095DD') {
    super(x, y, radius * 2, radius * 2, color);
    this.radius = radius;
    this.dx = 2;
    this.dy = -2;
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

class Brick extends Sprite {
  constructor(x, y, width, height, color) {
    super(x, y, width, height, color);
    this.status = 1;
  }
}

makeBricks();

function makeBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r += 1) {
      const x = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
      const y = (c * (brickHeight + brickPadding)) + brickOffsetTop;
      bricks[c][r] = new Brick(x, y, brickWidth, brickHeight, objcolor);
    }
  }
}

class Paddle extends Sprite{
  constructor(x, y, width, height, color) {
    super(x,y,width,height,color);
  }
}

let paddle = new Paddle(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);

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
      const brick = bricks[c][r];
      if (brick.status === 1) {
        brick.render(ctx);
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

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = objcolor;
  ctx.fillText(`Score: ${score}`, 8, 20);
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
  ball.render(ctx);
  paddle.render(ctx)
  drawScore();
  drawLives();
  collisionDetection();
  ball.move();
  arrowKeyChecker();
  gameLogic();

  requestAnimationFrame(draw);
}

export default Sprite;
draw();
