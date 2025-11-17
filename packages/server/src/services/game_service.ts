import { randomUUID } from 'crypto';

import { Game } from '../core/game/game';
import type { IGame } from '../core/game/types';
import { gameRepository } from '../data/game.repository';
import type { IGameRepository } from '../data/types';

import type { IGameService } from './types';

class GameService implements IGameService {
	private readonly repository: IGameRepository;

	constructor(repository: IGameRepository) {
		this.repository = repository;
	}

	public createNewGame(): IGame {
		const gameId = randomUUID();
		const playerId = randomUUID();

		const newGame: IGame = new Game(gameId);
		newGame.addPlayer(playerId);

		this.repository.save(newGame);
		return newGame;
	}

	public joinGame(gameId: string): IGame {
		const joiningPlayerId = randomUUID();
		const foundGame = this.repository.findById(gameId);
		if (!foundGame) {
			throw new Error(`Game with ID ${gameId} not found.`);
		}

		foundGame.addPlayer(joiningPlayerId);

		return foundGame;
	}

	public reconnectPlayer(playerId: string, gameId: string): [boolean, IGame | null] {
		const foundGame = this.repository.findById(gameId);
		if (!foundGame) {
			return [false, null];
		}

		const player = foundGame.getPlayer(playerId);
		if (!player) {
			return [false, null];
		}

		return [true, foundGame];
	}

	// public updateSettings(
	// 	playerId: string,
	// 	payload: UpdateSettingsPayload
	// ): GameStateUpdatePayload {
	// 	throw new Error('Method not implemented.');
	// }

	// public placeShip(playerId: string, payload: PlaceShipPayload): GameStateUpdatePayload {
	// 	throw new Error('Method not implemented.');
	// }

	// public unplaceShip(playerId: string, payload: UnplaceShipPayload): GameStateUpdatePayload {
	// 	throw new Error('Method not implemented.');
	// }

	// public playerReady(playerId: string): GameStateUpdatePayload {
	// 	throw new Error('Method not implemented.');
	// }

	// public makeTurn(playerId: string, payload: MakeTurnPayload): TurnResultPayload {
	// 	throw new Error('Method not implemented.');
	// }

	// public surrender(playerId: string): GameStateUpdatePayload {
	// 	throw new Error('Method not implemented.');
	// }

	// public destroyLobby(playerId: string): void {
	// 	throw new Error('Method not implemented.');
	// }
}

// Export a singleton instance of the service
export const gameService = new GameService(gameRepository);
