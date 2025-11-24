import { ShipPlacementDTO, UpdateSettingsDTO } from '@sea-battle/shared';
import type { WebSocket } from 'ws';

import { IGame } from '../core/game/types';
import { gameService } from '../services/game_service';
import type { IGameService } from '../services/types';

import { mapToGameStateDTO } from './mapper';
import type { IWebSocketGateway } from './types';

class WebSocketGateway implements IWebSocketGateway {
	// Map to store connected clients with their player IDs: playerId, WebSocket
	private clients: Map<string, WebSocket> = new Map();
	private readonly gameService: IGameService;

	constructor(gameService: IGameService) {
		this.gameService = gameService;
	}

	public handleCreateGame(socket: WebSocket): void {
		if (socket) {
			const createdGame: IGame = this.gameService.createNewGame();
			const [player1] = createdGame.getPlayers();

			if (!player1) {
				console.error('Game create error: No players found in the created game.');

				throw new Error('Game creation failed: No players found.');
			}

			this.clients.set(player1.playerId, socket);

			socket.send(
				JSON.stringify({
					event: 'gameCreated',
					payload: mapToGameStateDTO(createdGame, player1.playerId),
				})
			);
		}
	}

	public handleJoinGame(socket: WebSocket, gameId: string): void {
		const updatedGame = this.gameService.joinGame(gameId);
		const [player1, player2] = updatedGame.getPlayers();

		if (!player1 || !player2) {
			throw new Error('Game join failed: No player found in Game.');
		}
		this.clients.set(player2.playerId, socket);

		for (const player of [player1, player2]) {
			this.clients.get(player.playerId)?.send(
				JSON.stringify({
					event: 'gameJoined',
					payload: mapToGameStateDTO(updatedGame, player.playerId),
				})
			);
		}
	}

	public handleReconnect(socket: WebSocket, playerId: string, gameId: string): void {
		const [isReconectable, actualGameState] = this.gameService.reconnectPlayer(
			playerId,
			gameId
		);

		if (!isReconectable || !actualGameState) {
			throw new Error('Reconnection failed: Invalid playerId or gameId.');
		}

		this.clients.set(playerId, socket);

		socket.send(
			JSON.stringify({
				event: 'reconnected',
				payload: mapToGameStateDTO(actualGameState, playerId),
			})
		);
	}

	public handleUpdateSettings(
		playerId: string,
		gameId: string,
		settings: UpdateSettingsDTO
	): void {
		const updatedGame = this.gameService.updateSettings(playerId, gameId, settings);

		for (const player of updatedGame.getPlayers()) {
			this.clients.get(player.playerId)?.send(
				JSON.stringify({
					event: 'updatedGameState',
					payload: mapToGameStateDTO(updatedGame, player.playerId),
				})
			);
		}
	}

	public handlePlaceFleet(gameId: string, playerId: string, fleet: ShipPlacementDTO[]): void {
		const updatedGame = this.gameService.placeFleet(gameId, playerId, fleet);
		if (!updatedGame) {
			throw new Error('Place fleet failed: Invalid gameId.');
		}

		this.clients.get(playerId)?.send(
			JSON.stringify({
				event: 'updatedGameState',
				payload: mapToGameStateDTO(updatedGame, playerId),
			})
		);
	}

	// public handlePlayerReady(socket: WebSocket): GameStateUpdatePayload {
	// 	throw new Error('Method not implemented.');
	// }

	// public handleMakeTurn(socket: WebSocket, payload: MakeTurnPayload): TurnResultPayload {
	// 	throw new Error('Method not implemented.');
	// }

	// public handleSurrender(socket: WebSocket): GameStateUpdatePayload {
	// 	throw new Error('Method not implemented.');
	// }

	// public handleReturnToLobby(socket: WebSocket): void {
	// 	throw new Error('Method not implemented.');
	// }

	// public handleDestroyLobby(socket: WebSocket): void {
	// 	throw new Error('Method not implemented.');
	// }
}

// Export a singleton instance of the gateway
export const webSocketGateway = new WebSocketGateway(gameService);
