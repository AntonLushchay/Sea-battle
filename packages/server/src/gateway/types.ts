import { CoordsDTO, ShipPlacementDTO, UpdateSettingsDTO } from '@sea-battle/shared';
import type { WebSocket } from 'ws';

export interface IWebSocketGateway {
	handleCreateGame(socket: WebSocket): void;
	handleJoinGame(socket: WebSocket, gameId: string): void;
	handleReconnect(socket: WebSocket, playerId: string, gameId: string): void;
	handleClientDisconnect(socket: WebSocket): void;
	handlePong(socket: WebSocket): void;
	handleUpdateSettings(playerId: string, gameId: string, settings: UpdateSettingsDTO): void;
	handlePlaceFleet(gameId: string, playerId: string, fleet: ShipPlacementDTO[]): void;
	handlePlayerReadyChange(playerId: string, gameId: string): void;
	handleStartGame(playerId: string, gameId: string): void;
	handleMakeTurn(playerId: string, gameId: string, coord: CoordsDTO): void;
	handleSurrender(playerId: string, gameId: string): void;
	handleResetGame(playerId: string, gameId: string): void;
	handleExitGame(playerId: string, gameId: string): void;
}
