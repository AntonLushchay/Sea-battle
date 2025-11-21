import type { GameStatus, UpdateSettingsDTO } from '@sea-battle/shared';

import { IPlayer } from '../player/types';

export interface IGame {
	gameId: string;
	status: GameStatus;
	currentPlayerId: string | null;
	hostPlayerId: string | null;
	addPlayer(playerId: string): void;
	getPlayers(): IPlayer[];
	getPlayer(playerId: string): IPlayer | undefined;
	getEnemyPlayer(myPlayerId: string): IPlayer | undefined;
	isHost(playerId: string): boolean;
	updateSettings(playerId: string, settings: UpdateSettingsDTO): void;
	// placeShip(playerId: string, placement: PlaceShipPayload): void;
	// unplaceShip(playerId: string, payload: UnplaceShipPayload): void;
	// playerReady(playerId: string): void;
	// processTurn(playerId: string, coords: CoordsDTO): ShotResult;
}
