// Shared types and utilities
export interface GameConfig {
	boardSize: number;
	shipCount: number;
}

export const DEFAULT_CONFIG: GameConfig = {
	boardSize: 10,
	shipCount: 5,
};

const createGame = (): GameConfig => {
	return { ...DEFAULT_CONFIG };
};

export { createGame };
