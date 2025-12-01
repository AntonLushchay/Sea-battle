import type {
	CoordsDTO,
	GameStatus,
	LastTurnDTO,
	ShipPlacementDTO,
	UpdateSettingsDTO,
} from '@sea-battle/shared';

import { IPlayer } from '../player/types';

export interface IGame {
	gameId: string;
	status: GameStatus;
	currentPlayerId: string | null;
	hostPlayerId: string | null;
	winnerPlayerId: string | null;
	setLastTurn(value: LastTurnDTO | null): void;
	getLastTurn(): LastTurnDTO | null;
	addPlayer(playerId: string): void;
	getPlayers(): IPlayer[];
	getPlayer(playerId: string): IPlayer | undefined;
	getEnemyPlayer(myPlayerId: string): IPlayer | undefined;
	isHost(playerId: string): boolean;
	markPlayerConnect(playerId: string): void;
	markPlayerDisconnect(playerId: string): void;
	isGameAlive(): boolean;
	updateSettings(playerId: string, settings: UpdateSettingsDTO): void;
	placeFleet(playerId: string, fleet: ShipPlacementDTO[]): void;
	playerReadyChange(playerId: string): void;
	startGame(playerId: string): void;
	processTurn(playerId: string, coords: CoordsDTO): void;
	surrender(playerId: string): void;
	resetGame(playerId: string): void;
	removePlayer(playerId: string): void;
}
