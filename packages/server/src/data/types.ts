import type { IGame } from '../core/game/types';

export interface IGameRepository {
	save(game: IGame): void;
	findById(gameId: string): IGame | undefined;
	findAll(): IGame[];
	delete(gameId: string): void;
}
