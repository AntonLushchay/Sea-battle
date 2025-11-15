import type { WebSocket } from 'ws';

import { IGame } from '../core/game/types';
import { gameService } from '../services/game_service';
import type { IGameService } from '../services/types';

import { mapToGameStateDTO } from './mapper';
import type { IWebSocketGateway } from './types';

class WebSocketGateway implements IWebSocketGateway {
	private clients: Map<string, WebSocket> = new Map();
	private readonly gameService: IGameService;

	constructor(gameService: IGameService) {
		this.gameService = gameService;
	}

	public handleCreateGame(socket: WebSocket): void {
		if (socket) {
			const createdGame: IGame = this.gameService.createNewGame();
			const [firstPlayer] = createdGame.getPlayers();

			if (!firstPlayer) {
				console.error('Game create error: No players found in the created game.');

				throw new Error('Game creation failed: No players found.');
			}

			this.clients.set(firstPlayer.playerId, socket);

			const gameCreatedPayload = mapToGameStateDTO(createdGame, firstPlayer.playerId);

			socket.send(
				JSON.stringify({
					event: 'gameCreated',
					payload: gameCreatedPayload,
				})
			);
		}
	}

	public handleJoinGame(socket: WebSocket, gameId: string): void {
		const updatedGame = this.gameService.joinGame(gameId);
		const [player1, joiningPlayer] = updatedGame.getPlayers();

		if (!joiningPlayer || !player1) {
			throw new Error('Game join failed: No player found in Game.');
		}
		this.clients.set(joiningPlayer.playerId, socket);

		const updatedGamePayloadForPlayer1 = mapToGameStateDTO(updatedGame, player1.playerId);
		const updatedGamePayloadForJoiningPlayer = mapToGameStateDTO(
			updatedGame,
			joiningPlayer.playerId
		);

		this.clients.get(player1.playerId)?.send(
			JSON.stringify({
				event: 'gameJoined',
				payload: updatedGamePayloadForPlayer1,
			})
		);

		this.clients.get(joiningPlayer.playerId)?.send(
			JSON.stringify({
				event: 'gameJoined',
				payload: updatedGamePayloadForJoiningPlayer,
			})
		);
	}

	// public handleUpdateSettings(
	// 	socket: WebSocket,
	// 	payload: UpdateSettingsPayload
	// ): GameStateUpdatePayload {
	// 	throw new Error('Method not implemented.');
	// }

	// public handlePlaceShip(socket: WebSocket, payload: PlaceShipPayload): GameStateUpdatePayload {
	// 	throw new Error('Method not implemented.');
	// }

	// public handleUnplaceShip(
	// 	socket: WebSocket,
	// 	payload: UnplaceShipPayload
	// ): GameStateUpdatePayload {
	// 	throw new Error('Method not implemented.');
	// }

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

	// private broadcastToPlayers(gameState: GameStateDTO): void {
	// 	// Logic to send updates to all players in a game
	// }
}

// Export a singleton instance of the gateway
export const webSocketGateway = new WebSocketGateway(gameService);
