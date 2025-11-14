import { randomUUID } from 'crypto';

import type {} from // GameStateUpdatePayload,
// JoinGamePayload,
// MakeTurnPayload,
// PlaceShipPayload,
// TurnResultPayload,
// UnplaceShipPayload,
// UpdateSettingsPayload,
'@sea-battle/shared';

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

	// public joinGame(playerId: string, payload: JoinGamePayload): GameStateUpdatePayload {
	// 	throw new Error('Method not implemented.');
	// }

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
