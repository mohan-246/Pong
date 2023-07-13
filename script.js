const paddle = document.getElementById("bat");
const ball = document.getElementById("pong");
const scoreDiv = document.getElementById("score");
const pause = document.getElementById("pause");
const pauseDiv = document.getElementById("pauseDiv");
const notificationBox = document.querySelector(".notification-box");

let gameState = true;
let highScore = 0;
let score = 0;
let gameOver = false;
let paddleX = window.innerWidth / 2;
let paddleY = window.innerHeight - 10;
let ballX = window.innerWidth / 2,
  ballY = 5;
let dx = 1,
  dy = 1;

paddle.style.left = paddleX + "px";
paddle.style.top = paddleY + "px";

document.getElementById("highscore").innerHTML = `High score: ${highScore}`;
pauseDiv.onclick = () => {
  if (gameState && !gameOver) {
    pauseGame();
    gameState = false;
    pause.innerHTML = "&#x23f5";
    console.log("Entered pause");
  } else if (!gameState && !gameOver) {
    pause.innerHTML = "&#10074&#10074";
    resumeGame();
    gameState = true;
    console.log("Entered resume");
  } else if (gameOver) {
    console.log("Entered reset");
    pause.innerHTML = "&#10074&#10074";
    gameOver = false;
    gameState = true;
    ballX = window.innerWidth / 2;
    ballY = 5;
    score = 0;
    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
    notificationBox.classList.add("hidden");
    notificationBox.classList.remove("flex");
    setTimeout(() => {
      notificationBox.classList.remove("hidden");
      notificationBox.classList.add("flex");
    }, 6000);
    resumeGame();
  }
};
document.addEventListener("keydown", function (event) {
  if (event.code === "ArrowLeft") {
    movePaddle(-64);
  } else if (event.code === "ArrowRight") {
    movePaddle(64);
  }
});

function movePaddle(deltaX) {
  paddleX += deltaX;

  if (paddleX < 0) {
    paddleX = 0;
  } else if (paddleX + 120 > window.innerWidth) {
    paddleX = window.innerWidth - 128;
  }

  paddle.style.left = paddleX + "px";
}

function moveBall() {
  ballX += dx;
  ballY += dy;

  // Collision with walls
  if (ballY < 0) {
    dy = -dy;
  }

  // Collision with paddle
  if (paddleY == ballY && ballX >= paddleX && ballX <= paddleX + 128) {
    dy = -dy;
    score++;
    scoreDiv.innerHTML = "Score: " + score;
    if (score > highScore) {
      highScore = score;
    }

    document.getElementById("highscore").innerHTML = `High score: ${highScore}`;
  }

  // Reset ball position if it goes out of bounds
  if (ballX < 0 || ballX > window.innerWidth) {
    dx = -dx;
  }
  // Collision with paddle
  if (ballY > window.innerHeight + 10 && !gameOver) {
    gameOver = true;
    gameState = false;
    pause.innerHTML = "&#128472";
    sendNotification("GAME OVER!");
    pauseGame();
  }

  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
}

function pauseGame() {
  clearInterval(gameFlow);
  gameFlow = null;
}
function resumeGame() {
  gameFlow = setInterval(moveBall, 1);
}

function sendNotification(text) {
  let component = document.createElement("div");
  component.className = `relative flex items-center bg-transparent text-white text-6xl font-bold px-4 py-3 rounded-md opacity-0 transform transition-all duration-500 mb-1`;
  component.innerHTML = `<p>${text}</p>`;
  notificationBox.appendChild(component);
  setTimeout(() => {
    component.classList.remove("opacity-0");
    component.classList.add("opacity-1");
  }, 1); //1ms For fixing opacity on new element
  setTimeout(() => {
    component.classList.remove("opacity-1");
    component.classList.add("opacity-0");
    //component.classList.add("py-0"); //it's a little bit buggy when send multiple alerts
    component.style.margin = 0;
    component.style.padding = 0;
  }, 5000);
  setTimeout(() => {
    component.style.setProperty("height", "0", "important");
  }, 5100);
  setTimeout(() => {
    notificationBox.removeChild(component);
  }, 5700);
  //If you can do something more elegant than timeouts, please do, but i can't
}

let gameFlow = setInterval(moveBall, 1);
