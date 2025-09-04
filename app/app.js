import { draw,restartGame, getSpeedLabel, updateSpeedDisplay,initializeGame,showExistingThemes } from './core.js';
import './eventListeners.js';

initializeGame().then(() => {
    restartGame()
})


