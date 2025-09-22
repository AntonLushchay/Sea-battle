import type { ID } from '@sea-battle/shared';

import type { IGame } from '../core/game';

export interface IGameRepository {
	save(game: IGame): void;
	findById(gameId: ID): IGame | undefined;
	delete(gameId: ID): void;
}

class GameRepositoryImpl implements IGameRepository {
	private games: Map<ID, IGame> = new Map();

	public save(game: IGame): void {
		this.games.set(game.getId(), game);
	}

	public findById(gameId: ID): IGame | undefined {
		return this.games.get(gameId);
	}

	public delete(gameId: ID): void {
		this.games.delete(gameId);
	}
}

// Export a singleton instance of the repository
export const gameRepository: IGameRepository = new GameRepositoryImpl();
