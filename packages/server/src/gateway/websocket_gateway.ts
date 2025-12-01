import {
	CoordsDTO,
	GameCreatedMessage,
	GameJoinedMessage,
	GameStateUpdatedMessage,
	PlayerDisconnectedMessage,
	ReconnectedMessage,
	ShipPlacementDTO,
	UpdateSettingsDTO,
} from '@sea-battle/shared';
import type { WebSocket } from 'ws';

import { IGame } from '../core/game/types';
import { gameService } from '../services/game_service';
import type { IGameService } from '../services/types';

import { mapToGameStateDTO } from './mapper';
import type { IWebSocketGateway } from './types';

const DISCONNECT_TIMEOUT_MS = 30000; // 30 seconds

class WebSocketGateway implements IWebSocketGateway {
	// Map to store connected clients with their player IDs: playerId, WebSocket
	private clients: Map<string, { ws: WebSocket; isAlive: boolean }> = new Map();
	private readonly gameService: IGameService;

	constructor(gameService: IGameService) {
		this.gameService = gameService;

		setInterval(() => {
			for (const client of this.clients.values()) {
				if (client.isAlive) {
					client.isAlive = false;
					client.ws.ping();
				} else {
					client.ws.terminate();
				}
			}
		}, DISCONNECT_TIMEOUT_MS);
	}

	public handleCreateGame(socket: WebSocket): void {
		if (socket) {
			const createdGame: IGame = this.gameService.createNewGame();
			const [player1] = createdGame.getPlayers();

			if (!player1) {
				throw new Error('Game creation failed: No players found.');
			}

			this.clients.set(player1.playerId, { ws: socket, isAlive: true });

			const gameCreatedMessage: GameCreatedMessage = {
				event: 'gameCreated',
				payload: mapToGameStateDTO(createdGame, player1.playerId),
			};
			socket.send(JSON.stringify(gameCreatedMessage));
		}
	}

	public handleJoinGame(socket: WebSocket, gameId: string): void {
		const updatedGame = this.gameService.joinGame(gameId);
		const [player1, player2] = updatedGame.getPlayers();

		if (!player1 || !player2) {
			throw new Error('Game join failed: No player found in Game.');
		}
		this.clients.set(player2.playerId, { ws: socket, isAlive: true });

		for (const player of [player1, player2]) {
			const gameJoinedMessage: GameJoinedMessage = {
				event: 'gameJoined',
				payload: mapToGameStateDTO(updatedGame, player.playerId),
			};
			this.clients.get(player.playerId)?.ws.send(JSON.stringify(gameJoinedMessage));
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

		this.clients.set(playerId, { ws: socket, isAlive: true });

		for (const player of actualGameState.getPlayers()) {
			const gameReconnectedMessage: ReconnectedMessage = {
				event: 'reconnected',
				payload: mapToGameStateDTO(actualGameState, player.playerId),
			};
			this.clients.get(player.playerId)?.ws.send(JSON.stringify(gameReconnectedMessage));
		}
	}

	public handleClientDisconnect(socket: WebSocket): void {
		for (const [playerId, client] of this.clients.entries()) {
			if (client.ws === socket) {
				this.clients.delete(playerId);

				const updatedGame = this.gameService.clientDisconnect(
					playerId,
					this.broadcastGameStateUpdate.bind(this)
				);

				for (const player of updatedGame.getPlayers()) {
					const PlayerDisconnectedMessage: PlayerDisconnectedMessage = {
						event: 'playerDisconnected',
						payload: {
							playerId,
							gameState: mapToGameStateDTO(updatedGame, player.playerId),
						},
					};
					this.clients
						.get(player.playerId)
						?.ws.send(JSON.stringify(PlayerDisconnectedMessage));
				}
			}
		}
	}

	public handlePong(socket: WebSocket): void {
		for (const client of this.clients.values()) {
			if (client.ws === socket) {
				client.isAlive = true;
			}
		}
	}

	public handleUpdateSettings(
		playerId: string,
		gameId: string,
		settings: UpdateSettingsDTO
	): void {
		const updatedGame = this.gameService.updateSettings(playerId, gameId, settings);

		this.broadcastGameStateUpdate(updatedGame);
	}

	public handlePlaceFleet(gameId: string, playerId: string, fleet: ShipPlacementDTO[]): void {
		const updatedGame = this.gameService.placeFleet(gameId, playerId, fleet);
		if (!updatedGame) {
			throw new Error('Place fleet failed: Invalid gameId.');
		}

		this.broadcastGameStateUpdate(updatedGame);
	}

	public handlePlayerReadyChange(playerId: string, gameId: string): void {
		const updatedGame = this.gameService.playerReadyChange(playerId, gameId);

		this.broadcastGameStateUpdate(updatedGame);
	}

	public handleStartGame(playerId: string, gameId: string): void {
		const updatedGame = this.gameService.startGame(playerId, gameId);

		this.broadcastGameStateUpdate(updatedGame);
	}

	public handleMakeTurn(playerId: string, gameId: string, coord: CoordsDTO): void {
		const updatedGame = this.gameService.makeTurn(playerId, gameId, coord);

		this.broadcastGameStateUpdate(updatedGame);
	}

	public handleSurrender(playerId: string, gameId: string): void {
		const updatedGame = this.gameService.surrender(playerId, gameId);

		this.broadcastGameStateUpdate(updatedGame);
	}

	public handleResetGame(playerId: string, gameId: string): void {
		const updatedGame = this.gameService.resetGame(playerId, gameId);

		this.broadcastGameStateUpdate(updatedGame);
	}

	public handleExitGame(playerId: string, gameId: string): void {
		const updatedGame = this.gameService.exitGame(playerId, gameId);
		this.clients.delete(playerId);

		this.broadcastGameStateUpdate(updatedGame);
	}

	private broadcastGameStateUpdate(updatedGame: IGame): void {
		for (const player of updatedGame.getPlayers()) {
			const updatedGameStateMessage: GameStateUpdatedMessage = {
				event: 'updatedGameState',
				payload: mapToGameStateDTO(updatedGame, player.playerId),
			};
			this.clients.get(player.playerId)?.ws.send(JSON.stringify(updatedGameStateMessage));
		}
	}
}

// Export a singleton instance of the gateway
export const webSocketGateway = new WebSocketGateway(gameService);
