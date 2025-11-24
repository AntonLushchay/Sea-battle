import { ShipPlacementDTO, UpdateSettingsDTO } from '@sea-battle/shared';
import type { WebSocket } from 'ws';

export interface IWebSocketGateway {
	handleCreateGame(socket: WebSocket): void;
	handleJoinGame(socket: WebSocket, gameId: string): void;
	handleReconnect(socket: WebSocket, playerId: string, gameId: string): void;
	handleUpdateSettings(playerId: string, gameId: string, settings: UpdateSettingsDTO): void;
	handlePlaceFleet(gameId: string, playerId: string, fleet: ShipPlacementDTO[]): void;
	// handlePlayerReady(socket: WebSocket): GameStateUpdatePayload;
	// handleMakeTurn(socket: WebSocket, payload: MakeTurnPayload): TurnResultPayload;
	// handleSurrender(socket: WebSocket): GameStateUpdatePayload;
	// handleReturnToLobby(socket: WebSocket): void;
	// handleDestroyLobby(socket: WebSocket): void;
}
