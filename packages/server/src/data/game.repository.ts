import type { IGame } from '../core/game/types';

import { IGameRepository } from './types';

class GameRepositoryImpl implements IGameRepository {
	private games: Map<string, IGame> = new Map();

	public save(game: IGame): void {
		this.games.set(game.gameId, game);
	}

	public findByGameId(gameId: string): IGame | undefined {
		return this.games.get(gameId);
	}

	public findByPlayerId(playerId: string): IGame | undefined {
		for (const game of this.games.values()) {
			if (game.getPlayer(playerId)) {
				return game;
			}
		}
		return undefined;
	}

	public findAll(): IGame[] {
		return Array.from(this.games.values());
	}

	public delete(gameId: string): void {
		this.games.delete(gameId);
	}
}

// Export a singleton instance of the repository
export const gameRepository: IGameRepository = new GameRepositoryImpl();
