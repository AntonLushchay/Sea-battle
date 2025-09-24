import type {
	GameCreatedPayload,
	GameStateUpdatePayload,
	ID,
	JoinGamePayload,
	MakeTurnPayload,
	PlaceShipPayload,
	TurnResultPayload,
	UnplaceShipPayload,
	UpdateSettingsPayload,
} from '@sea-battle/shared';

import { gameRepository, type IGameRepository } from '../data/game.repository';

export interface IGameService {
	createNewGame(socketId: ID): GameCreatedPayload;
	joinGame(socketId: ID, payload: JoinGamePayload): GameStateUpdatePayload;
	updateSettings(socketId: ID, payload: UpdateSettingsPayload): GameStateUpdatePayload;
	placeShip(socketId: ID, payload: PlaceShipPayload): GameStateUpdatePayload;
	unplaceShip(socketId: ID, payload: UnplaceShipPayload): GameStateUpdatePayload;
	playerReady(socketId: ID): GameStateUpdatePayload;
	makeTurn(socketId: ID, payload: MakeTurnPayload): TurnResultPayload;
	surrender(socketId: ID): GameStateUpdatePayload;
	destroyLobby(socketId: ID): void;
}

export class GameService implements IGameService {
	constructor(private readonly repository: IGameRepository) {}

	public createNewGame(socketId: ID): GameCreatedPayload {
		throw new Error('Method not implemented.');
	}

	public joinGame(socketId: ID, payload: JoinGamePayload): GameStateUpdatePayload {
		throw new Error('Method not implemented.');
	}

	public updateSettings(socketId: ID, payload: UpdateSettingsPayload): GameStateUpdatePayload {
		throw new Error('Method not implemented.');
	}

	public placeShip(socketId: ID, payload: PlaceShipPayload): GameStateUpdatePayload {
		throw new Error('Method not implemented.');
	}

	public unplaceShip(socketId: ID, payload: UnplaceShipPayload): GameStateUpdatePayload {
		throw new Error('Method not implemented.');
	}

	public playerReady(socketId: ID): GameStateUpdatePayload {
		throw new Error('Method not implemented.');
	}

	public makeTurn(socketId: ID, payload: MakeTurnPayload): TurnResultPayload {
		throw new Error('Method not implemented.');
	}

	public surrender(socketId: ID): GameStateUpdatePayload {
		throw new Error('Method not implemented.');
	}

	public destroyLobby(socketId: ID): void {
		throw new Error('Method not implemented.');
	}
}

// Export a singleton instance of the service
export const gameService = new GameService(gameRepository);
