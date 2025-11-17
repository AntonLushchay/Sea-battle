import type { IGame } from '../core/game/types';

export interface IGameService {
	createNewGame(): IGame;
	joinGame(gameId: string): IGame;
	reconnectPlayer(playerId: string, gameId: string): [boolean, IGame | null];
	// updateSettings(playerId: string, payload: UpdateSettingsPayload): GameStateUpdatePayload;
	// placeShip(playerId: string, payload: PlaceShipPayload): GameStateUpdatePayload;
	// unplaceShip(playerId: string, payload: UnplaceShipPayload): GameStateUpdatePayload;
	// playerReady(playerId: string): GameStateUpdatePayload;
	// makeTurn(playerId: string, payload: MakeTurnPayload): TurnResultPayload;
	// surrender(playerId: string): GameStateUpdatePayload;
	// destroyLobby(playerId: string): void;
}
