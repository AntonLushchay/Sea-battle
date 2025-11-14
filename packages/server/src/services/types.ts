// import type {
// 	GameStateUpdatePayload,
// 	JoinGamePayload,
// 	MakeTurnPayload,
// 	PlaceShipPayload,
// 	TurnResultPayload,
// 	UnplaceShipPayload,
// 	UpdateSettingsPayload,
// } from '@sea-battle/shared';

import type { IGame } from '../core/game/types';

export interface IGameService {
	createNewGame(): IGame;
	// joinGame(playerId: string, payload: JoinGamePayload): GameStateUpdatePayload;
	// updateSettings(playerId: string, payload: UpdateSettingsPayload): GameStateUpdatePayload;
	// placeShip(playerId: string, payload: PlaceShipPayload): GameStateUpdatePayload;
	// unplaceShip(playerId: string, payload: UnplaceShipPayload): GameStateUpdatePayload;
	// playerReady(playerId: string): GameStateUpdatePayload;
	// makeTurn(playerId: string, payload: MakeTurnPayload): TurnResultPayload;
	// surrender(playerId: string): GameStateUpdatePayload;
	// destroyLobby(playerId: string): void;
}
