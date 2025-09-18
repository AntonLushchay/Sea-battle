// Server-side game logic
import { createGame, type GameConfig } from '@sea-battle/shared';

const game = createGame();
console.log('Server game created:', game);

const handleGameRequest = (): GameConfig => {
	return game;
};

export { handleGameRequest };
