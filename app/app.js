import { draw,restartGame, getSpeedLabel, updateSpeedDisplay,initializeGame } from './core.js';
import './eventListeners.js';

initializeGame().then(() => {
    restartGame()
})


