import { draw,restartGame, getSpeedLabel, updateSpeedDisplay } from './core.js';
import { gameState} from './core.js';

// controllers
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && gameState.direction !== "RIGHT") gameState.direction = "LEFT";
    else if (event.key === "ArrowUp" && gameState.direction !== "DOWN") gameState.direction = "UP";
    else if (event.key === "ArrowRight" && gameState.direction !== "LEFT") gameState.direction = "RIGHT";
    else if (event.key === "ArrowDown" && gameState.direction !== "UP") gameState.direction = "DOWN";

    if (!gameState.game) {
        gameState.game = setInterval(draw, gameState.speed);
        updateSpeedDisplay();


        setInterval(() => {
            if (gameState.snake.length % 5 === 0 && gameState.snake.length !== 0) {
                clearInterval(gameState.game);
                gameState.speed = Math.max(50, 150 - (gameState.snake.length / 5) * 10);
                gameState.game = setInterval(draw, gameState.speed);
                updateSpeedDisplay();
            }
        }, 1000);
    }
});

// control buttons
document.getElementById("startBtn").addEventListener("click", () => {
    restartGame();
});

document.getElementById("restartBtn").addEventListener("click", () => {
    restartGame();
});

document.getElementById("pauseBtn").addEventListener("click", () => {
    if (gameState.game) {
        clearInterval(gameState.game);
        gameState.game = null;
        document.getElementById("pauseBtn").innerText = "Resume";
    } else {
        gameState.game = setInterval(draw, 150);
        document.getElementById("pauseBtn").innerText = "Pause";
    }
});

document.getElementById("settingsBtn").addEventListener("click", () => {
    const settings = document.getElementById("settingsPanel");
    if (settings.style.display === "none" || !settings.style.display) {
        settings.style.display = "flex";
    } else {
        settings.style.display = "none";
    }
});

document.getElementById("closeSettingsPanelBtn").addEventListener("click", () => {
    document.getElementById("settingsPanel").style.display = "none";
});

