import type { IGame } from '../core/game/types';

export interface IGameRepository {
	save(game: IGame): void;
	findByGameId(gameId: string): IGame | undefined;
	findByPlayerId(playerId: string): IGame | undefined;
	findAll(): IGame[];
	delete(gameId: string): void;
}
