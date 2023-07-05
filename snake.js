// Set up canvas and game variables
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 10;
const middleX = Math.floor(canvas.width / 2 / gridSize) * gridSize;
const middleY = Math.floor(canvas.height / 2 / gridSize) * gridSize;
let snake = [{x: middleX, y: middleY}];
let rivalSnake = [{x: middleX, y: middleY + gridSize}];
let direction = "right";
let rivalDirection = "left";
let food = [getRandomFood(), getRandomFood(), getRandomFood(),getRandomFood(), getRandomFood(), getRandomFood()];
let isDead = false;
let winner = null;

// Main game loop
setInterval(() => {
  clearCanvas();
  if (!isDead) {
    moveSnake();
    moveRivalSnake();
    drawSnake();
    drawRivalSnake();
    drawFood();
  } else {
    drawGameOver();
  }
}, 100);

// Handle keyboard input
document.addEventListener("keydown", (event) => {
  if (!isDead) {
    if (event.key === "ArrowUp" && direction !== "down") {
      direction = "up";
    } else if (event.key === "ArrowDown" && direction !== "up") {
      direction = "down";
    } else if (event.key === "ArrowLeft" && direction !== "right") {
      direction = "left";
    } else if (event.key === "ArrowRight" && direction !== "left") {
      direction = "right";
    } else if (event.key === "w" && rivalDirection !== "down") {
      rivalDirection = "up";
    } else if (event.key === "s" && rivalDirection !== "up") {
      rivalDirection = "down";
    } else if (event.key === "a" && rivalDirection !== "right") {
      rivalDirection = "left";
    } else if (event.key === "d" && rivalDirection !== "left") {
      rivalDirection = "right";
    }
  } else {
    if (event.key === "Enter") {
      resetGame();
    }
  }
});

// Helper functions
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
  const head = snake[0];
  let newX = head.x;
  let newY = head.y;

  if (direction === "up") {
    newY -= gridSize;
  } else if (direction === "down") {
    newY += gridSize;
  } else if (direction === "left") {
    newX -= gridSize;
  } else if (direction === "right") {
    newX += gridSize;
  }

  // Wrap snake to other side of map if it collides with the wall
  if (newX < 0) {
    newX = canvas.width - gridSize;
  } else if (newX >= canvas.width) {
    newX = 0;
  } else if (newY < 0) {
    newY = canvas.height - gridSize;
  } else if (newY >= canvas.height) {
    newY = 0;
  }

  // Check for collision with rival snake
  if (checkCollision(newX, newY, rivalSnake)) {
    isDead = true;
    winner = "Purple Snake";
  }

// Check for collision with food
let foodEaten = false;
for (let i = 0; i < food.length; i++) {
if (newX === food[i].x && newY === food[i].y) {
food[i] = getRandomFood();
foodEaten = true;
}
}
if (!foodEaten) {
snake.pop();
}

  // Check for collision with own tail
  if (checkCollision(newX, newY, snake.slice(1))) {
    isDead = true;
    winner = "Purple Snake";
  }

  // Add new head to snake
  snake.unshift({x: newX, y: newY});
}

function moveRivalSnake() {
  const head = rivalSnake[0];
  let newX = head.x;
  let newY = head.y;

  if (rivalDirection === "up") {
    newY -= gridSize;
  } else if (rivalDirection === "down") {
    newY += gridSize;
  } else if (rivalDirection === "left") {
    newX -= gridSize;
  } else if (rivalDirection === "right") {
    newX += gridSize;
  }

  // Wrap rival snake to other side of map if it collides with the wall
  if (newX < 0) {
    newX = canvas.width - gridSize;
  } else if (newX >= canvas.width) {
    newX = 0;
  } else if (newY < 0) {
    newY = canvas.height - gridSize;
  } else if (newY >= canvas.height) {
    newY = 0;
  }

  // Check for collision with green snake
  if (checkCollision(newX, newY, snake)) {
    isDead = true;
    winner = "Green Snake";
  }

// Check for collision with food
let foodEaten = false;
for (let i = 0; i < food.length; i++) {
if (newX === food[i].x && newY === food[i].y) {
food[i] = getRandomFood();
foodEaten = true;
}
}
if (!foodEaten) {
rivalSnake.pop();
}

  // Check for collision with own tail
  if (checkCollision(newX, newY, rivalSnake.slice(1))) {
    isDead = true;
    winner = "Green Snake";
  }

  // Add new head to rival snake
  rivalSnake.unshift({x: newX, y: newY});
}

function drawSnake() {
  ctx.fillStyle = "green";
  for (const part of snake) {
    ctx.fillRect(part.x, part.y, gridSize, gridSize);
  }
}

function drawRivalSnake() {
  ctx.fillStyle = "purple";
  for (const part of rivalSnake) {
    ctx.fillRect(part.x, part.y, gridSize, gridSize);
  }
}

function drawFood() {
    ctx.fillStyle = "red";
    for (const f of food) {
    ctx.fillRect(f.x, f.y, gridSize, gridSize);
    }
    }

function getRandomFood() {
  const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
  const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
  return {x, y};
}

function drawGameOver() {
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  if (winner) {
    ctx.fillText(`${winner} won!`, canvas.width / 2, canvas.height / 2);
  } else {
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
  }
  ctx.font = "20px Arial";
  ctx.fillText("Press Enter to play again", canvas.width / 2, canvas.height / 2 + 30);
}

function resetGame() {
  snake = [{x: middleX, y: middleY}];
  rivalSnake = [{x: middleX, y: middleY + gridSize}];
  direction = "right";
  rivalDirection = "left";
  food = [getRandomFood(), getRandomFood(), getRandomFood(),getRandomFood(), getRandomFood(), getRandomFood()];
  isDead = false;
  winner = null;
}

function checkCollision(x, y, snakeToCheck) {
  for (const part of snakeToCheck) {
    if (part.x === x && part.y === y) {
      return true;
    }
  }
  return false;
}