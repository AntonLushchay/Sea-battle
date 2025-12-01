import { CoordsDTO, ShipPlacementDTO, UpdateSettingsDTO } from '@sea-battle/shared';

import type { IGame } from '../core/game/types';

export interface IGameService {
	createNewGame(): IGame;
	joinGame(gameId: string): IGame;
	reconnectPlayer(playerId: string, gameId: string): [boolean, IGame | null];
	clientDisconnect(playerId: string, callback: (game: IGame) => void): IGame;
	updateSettings(playerId: string, gameId: string, settings: UpdateSettingsDTO): IGame;
	placeFleet(gameId: string, playerId: string, fleet: ShipPlacementDTO[]): IGame;
	playerReadyChange(playerId: string, gameId: string): IGame;
	startGame(playerId: string, gameId: string): IGame;
	makeTurn(playerId: string, gameId: string, coord: CoordsDTO): IGame;
	surrender(playerId: string, gameId: string): IGame;
	resetGame(playerId: string, gameId: string): IGame;
	exitGame(playerId: string, gameId: string): IGame;
}
