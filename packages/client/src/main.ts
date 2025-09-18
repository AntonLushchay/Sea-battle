// Client-side game logic
import { createGame } from '@sea-battle/shared';
import './styles.scss';

const game = createGame();
console.log('Game created:', game);

const startGame = (): void => {
	console.log('Starting game with config:', game);
};

export { startGame };
