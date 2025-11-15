import type { WebSocket } from 'ws';

export interface IWebSocketGateway {
	handleCreateGame(socket: WebSocket): void;
	handleJoinGame(socket: WebSocket, gameId: string): void;
	// handleUpdateSettings(socket: WebSocket, payload: UpdateSettingsPayload): GameStateUpdatePayload;
	// handlePlaceShip(socket: WebSocket, payload: PlaceShipPayload): GameStateUpdatePayload;
	// handleUnplaceShip(socket: WebSocket, payload: UnplaceShipPayload): GameStateUpdatePayload;
	// handlePlayerReady(socket: WebSocket): GameStateUpdatePayload;
	// handleMakeTurn(socket: WebSocket, payload: MakeTurnPayload): TurnResultPayload;
	// handleSurrender(socket: WebSocket): GameStateUpdatePayload;
	// handleReturnToLobby(socket: WebSocket): void;
	// handleDestroyLobby(socket: WebSocket): void;
}
