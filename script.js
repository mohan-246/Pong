// let bat = document.getElementById("bat");

// document.addEventListener("keydown", function (event) {
//   switch (event.key) {
//     case "ArrowLeft":
//       bat.style.transform = "translateX(1)";
//     case "ArrowRigth":
//       bat.style.transform = "translateX(1)";
//     default:
//       return;
//   }
// });
const paddle = document.getElementById("bat");
const ball = document.getElementById("pong");

let scoreDiv=document.getElementById("score")
let i=0;
let score = 0;
let gameover = false;
let paddleX = window.innerWidth / 2;
let paddleY = window.innerHeight - 10;
let ballX = window.innerWidth / 2,
  ballY = 5;
let dx = 1,
  dy = 1;

paddle.style.left = paddleX + "px";
paddle.style.top = paddleY + "px";

document.addEventListener("keydown", function (event) {
  if (event.code === "ArrowLeft") {
    movePaddle(-64);
  } else if (event.code === "ArrowRight") {
    movePaddle(64);
  }
});

function movePaddle(deltaX) {
  paddleX+=deltaX;
  gsap.to('#bat',{x:deltaX,ease:"linear",duration:0.3,yoyo:true})

  if (paddleX < 0) {
    paddleX = 0;
  } else if (paddleX+120 > window.innerWidth) {
    paddleX = window.innerWidth-128;
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
  // if(ballY > window.innerHeight) {
  // dy=-dy
  // }
  // Collision with paddle
  if (paddleY == ballY && ballX >= paddleX && ballX <= paddleX + 128) {
    dy = -dy;
    score++;
    scoreDiv.innerHTML="Score: " + score;
  }
  // console.log(paddleX,ballX)

  // Reset ball position if it goes out of bounds
  if (ballX < 0 || ballX > window.innerWidth) {
    
    dx = -dx;
  }
  if (ballY > window.innerHeight + 10) {
    dy = 0;
    dx = 0;
    gameover = true;
    sendNotification("GAME OVER!");
    clearInterval(myInterval);
  }
  
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
}

function sendNotification(text) {
  let notificationBox = document.querySelector(".notification-box");

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
    //component.classList.add("-translate-y-80"); //it's a little bit buggy when send multiple alerts
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

const myInterval = setInterval(moveBall, 1);
