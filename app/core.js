// export this functions
export {draw, restartGame, getSpeedLabel, updateSpeedDisplay,initializeGame};

// size of each box
const box = 20;
// Preload images at the top of the file
const snakeHeadImg = new Image();
snakeHeadImg.src = 'assets/snake-head-full.png';

const snakeBodyImg = new Image();
snakeBodyImg.src = 'assets/snake-body-full.png';

const foodImg = new Image();
foodImg.src = 'assets/red-apple.png';

export const gameState = {
    game: null,
    speed: 150,
    direction: "RIGHT",
    snake: [{x: 9 * box, y: 10 * box}]
};
// game variables

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};

// restart game function
function restartGame() {
    gameState.snake = [{x: 9 * box, y: 10 * box}]; // initial position of the snake
    food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
    gameState.direction = "RIGHT";

    gameState.speed = 150;
    updateSpeedDisplay();
    document.getElementById("score").innerText = "0";
    document.getElementById("gameOverPanel").style.display = "none";
    if (gameState.game) clearInterval(gameState.game);
    gameState.game = null
    draw();
}

// Helper function to get rotation angle
function getHeadRotation(direction) {
    switch (direction) {
        case "UP":
            return 0;
        case "RIGHT":
            return Math.PI / 2;
        case "DOWN":
            return Math.PI;
        case "LEFT":
            return -Math.PI / 2;
        default:
            return 0;
    }
}

// main game function
function draw() {
    console.log('draw called');
    // background
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const snakeHeadImg = new Image();
    snakeHeadImg.src = 'assets/snake-head-full.png';

    const snakeBodyImg = new Image();
    snakeBodyImg.src = 'assets/snake-body-full.png';
    // snake
    for (let i = 0; i < gameState.snake.length; i++) {
        ctx.fillStyle = i === 0 ? "lime" : "green";
        // fill with snake head icon instead of rect
        if (i === 0) {
            ctx.save();
            ctx.translate(gameState.snake[i].x + box / 2, gameState.snake[i].y + box / 2);
            ctx.rotate(getHeadRotation(gameState.direction));
            ctx.drawImage(snakeHeadImg, -box / 2, -box / 2, box, box);
            ctx.restore();
        } else {
            // Determine orientation
            let prev = gameState.snake[i - 1];
            let curr = gameState.snake[i];
            ctx.save();
            ctx.translate(curr.x + box / 2, curr.y + box / 2);
            if (prev.x === curr.x) {
                // Vertical segment
                ctx.rotate(Math.PI / 2);
            }
            ctx.drawImage(snakeBodyImg, -box / 2, -box / 2, box, box);
            ctx.restore();
        }
    }

    // food
    //ctx.fillStyle = "red";
    //ctx.fillRect(food.x, food.y, box, box);
    const foodImg = new Image();
    foodImg.src = 'assets/red-apple.png';
    ctx.drawImage(foodImg, food.x, food.y, box, box);

    // old head position
    let headX = gameState.snake[0].x;
    let headY = gameState.snake[0].y;

    if (gameState.direction === "LEFT") headX -= box;
    if (gameState.direction === "UP") headY -= box;
    if (gameState.direction === "RIGHT") headX += box;
    if (gameState.direction === "DOWN") headY += box;

    // when snake eats the food
    if (headX === food.x && headY === food.y) {
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };

        // check if food spawns on the snake
        for (let i = 0; i < gameState.snake.length; i++) {
            if (food.x === gameState.snake[i].x && food.y === gameState.snake[i].y) {
                food.x = Math.floor(Math.random() * 20) * box;
                food.y = Math.floor(Math.random() * 20) * box;
                i = -1; // restart the loop to check again
            }
        }

    } else {
        gameState.snake.pop(); // remove the tail
    }

    // new head position
    let newHead = {x: headX, y: headY};

    // condition game over
    if (
        headX < 0 || headY < 0 ||
        headX >= canvas.width || headY >= canvas.height
    ) {
        clearInterval(gameState.game);
        const gameOverPanel = document.getElementById("gameOverPanel")
        document.getElementById("finalScore").innerText = (gameState.snake.length - 1).toString();
        gameOverPanel.style.display = "flex";
    }

    // bite itself
    for (let i = 1; i < gameState.snake.length; i++) {
        if (headX === gameState.snake[i].x && headY === gameState.snake[i].y) {
            clearInterval(gameState.game);
            const gameOverPanel = document.getElementById("gameOverPanel")
            document.getElementById("finalScore").innerText = (gameState.snake.length - 1).toString();
            gameOverPanel.style.display = "flex";
        }
    }

    gameState.snake.unshift(newHead);

    // score
    document.getElementById("score").innerText = (gameState.snake.length - 1).toString();


}

// speed label helper
function getSpeedLabel(speed) {
    if (speed >= 140) return "Very Slow";
    if (speed >= 120) return "Slow";
    if (speed >= 90) return "Normal";
    if (speed >= 70) return "Fast";
    return "Very Fast";
}

// update speed display
function updateSpeedDisplay() {
    const gauge = document.getElementById("speedGauge");
    gauge.innerHTML = "";
    const totalBars = 10;
    // Calculate how many bars to fill based on speed (150ms = 2 bars, 50ms = 10 bars)
    const filledBars = Math.max(2, Math.round(((150 - gameState.speed) / 100) * (totalBars - 2) + 2));

    for (let i = 0; i < totalBars; i++) {
        const bar = document.createElement("div");
        bar.style.height = "100%";
        bar.style.width = "10px";
        bar.style.borderRadius = "4px";
        bar.style.background = "#ccc";
        if (i < filledBars) {
            if (i === totalBars - 1) {
                bar.style.background = "red";
            } else {
                // Interpolate color from blue to red
                const ratio = i / (totalBars - 1);
                const r = Math.round(70 + ratio * (255 - 70));
                const g = Math.round(130 - ratio * 130);
                const b = Math.round(255 - ratio * 255);
                bar.style.background = `rgb(${r},${g},${b})`;
            }
        }
        gauge.appendChild(bar);
    }
}

function initializeGame() {
    return Promise.all([
        new Promise(resolve => snakeHeadImg.onload = resolve),
        new Promise(resolve => snakeBodyImg.onload = resolve),
        new Promise(resolve => foodImg.onload = resolve)
    ])
}
