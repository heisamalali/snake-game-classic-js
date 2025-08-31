const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20; // size of each box
let snake = [{x: 9 * box, y: 10 * box}]; // initial position of the snake
let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};
let direction = "RIGHT";

// controllers
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// control buttons
document.getElementById("startBtn").addEventListener("click", () => {
    location.reload(); // صفحه رو رفرش می‌کنیم برای شروع مجدد
});

document.getElementById("pauseBtn").addEventListener("click", () => {
    if (game) {
        clearInterval(game);
        game = null;
        document.getElementById("pauseBtn").innerText = "Resume";
    } else {
        game = setInterval(draw, 150);
        document.getElementById("pauseBtn").innerText = "Pause";
    }
});

document.getElementById("settingsBtn").addEventListener("click", () => {
    const settings = document.getElementById("settingsPanel");
    if (settings.style.display === "none" || !settings.style.display) {
        settings.style.display = "block";
    } else {
        settings.style.display = "none";
    }
});

function draw() {
    // پس‌زمینه
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // مار
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "lime" : "green";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // غذا
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // حرکت مار
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "UP") headY -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "DOWN") headY += box;

    // وقتی مار غذا بخوره
    if (headX === food.x && headY === food.y) {
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };

        // check if food spawns on the snake
        for (let i = 0; i < snake.length; i++) {
            if (food.x === snake[i].x && food.y === snake[i].y) {
                food.x = Math.floor(Math.random() * 20) * box;
                food.y = Math.floor(Math.random() * 20) * box;
                i = -1; // restart the loop to check again
            }
        }

    } else {
        snake.pop(); // دم رو حذف می‌کنیم
    }

    // سر جدید
    let newHead = {x: headX, y: headY};

    // شرط برخورد با دیوار
    if (
        headX < 0 || headY < 0 ||
        headX >= canvas.width || headY >= canvas.height
    ) {
        clearInterval(game);
        alert("Game Over 😢");
    }

    // شرط برخورد با خود مار
    for (let i = 1; i < snake.length; i++) {
        if (headX === snake[i].x && headY === snake[i].y) {
            clearInterval(game);
            alert("Game Over 😢");
        }
    }

    snake.unshift(newHead);

    // امتیاز
    document.getElementById("score").innerText = snake.length - 1;

    // سرعت بازی

}

let speed = 150; // initial speed in ms
function getSpeedLabel(speed) {
    if (speed >= 140) return "Very Slow";
    if (speed >= 120) return "Slow";
    if (speed >= 90) return "Normal";
    if (speed >= 70) return "Fast";
    return "Very Fast";
}

function updateSpeedDisplay() {
    const gauge = document.getElementById("speedGauge");
    gauge.innerHTML = "";
    const totalBars = 10;
    // Calculate how many bars to fill based on speed (150ms = 2 bars, 50ms = 10 bars)
    const filledBars = Math.max(2, Math.round(((150 - speed) / 100) * (totalBars - 2) + 2));

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

// Update speed when starting the game
updateSpeedDisplay();

let game = setInterval(draw, speed);

setInterval(() => {
    if (snake.length % 5 === 0 && snake.length !== 0) {
        clearInterval(game);
        speed = Math.max(50, 150 - (snake.length / 5) * 10);
        game = setInterval(draw, speed);
        updateSpeedDisplay();
    }
}, 1000);