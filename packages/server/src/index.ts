import { WebSocketServer } from 'ws';

import { webSocketGateway } from './gateway/websocket_gateway';
import {
	isCreateGameMessage,
	isExitGameMessage,
	isJoinToGameMessage,
	isMakeTurnMessage,
	isObjectWithEvent,
	isPlaceFleetMessage,
	isPlayerReadyMessage,
	isReconnectMessage,
	isResetGameMessage,
	isStartGameMessage,
	isSurrenderMessage,
	isUpdateSettingsMessage,
} from './utils/type_guards/type_guards';
import { ErrorMessage } from '@sea-battle/shared';

const wss = new WebSocketServer({ port: 8080 });

console.log('Сервер запущен на порту 8080 и ждёт подключения...');

wss.on('connection', (ws) => {
	console.log(`Client connected`);

	ws.send(JSON.stringify({ event: 'connected', payload: 'Welcome to the Sea Battle server!' }));

	// eslint-disable-next-line sonarjs/cognitive-complexity
	ws.on('message', (message: string) => {
		try {
			const data: unknown = JSON.parse(message);

			// Проверка на наличие event:string
			if (!isObjectWithEvent(data)) {
				throw new Error('Invalid message format: missing event');
			}

			// Обработка событий
			switch (data.event) {
				case 'createGame':
					if (!isCreateGameMessage(data)) {
						throw new Error('Invalid createGame message: should not have payload');
					}
					webSocketGateway.handleCreateGame(ws);
					break;

				case 'joinToGame':
					if (!isJoinToGameMessage(data)) {
						throw new Error('Invalid joinToGame message: payload.id must be string');
					}
					webSocketGateway.handleJoinGame(ws, data.payload.id);
					break;

				case 'reconnect':
					if (!isReconnectMessage(data)) {
						throw new Error(
							'Invalid reconnect message: payload must contain playerId and gameId'
						);
					}
					webSocketGateway.handleReconnect(
						ws,
						data.payload.playerId,
						data.payload.gameId
					);
					break;

				case 'updateSettings':
					if (!isUpdateSettingsMessage(data)) {
						throw new Error(
							'Invalid updateSettings message: payload must contain playerId, gameId and settings'
						);
					}
					webSocketGateway.handleUpdateSettings(
						data.payload.playerId,
						data.payload.gameId,
						data.payload.settings
					);
					break;

				case 'placeFleet':
					if (!isPlaceFleetMessage(data)) {
						throw new Error(
							'Invalid placeFleet message: payload must contain playerId, gameId, shipId, coords, orientation'
						);
					}
					webSocketGateway.handlePlaceFleet(
						data.payload.gameId,
						data.payload.playerId,
						data.payload.fleet
					);
					break;

				case 'playerReadyChange':
					if (!isPlayerReadyMessage(data)) {
						console.log('Invalid playerReady message payload:');
						throw new Error(
							'Invalid playerReady message: payload must contain playerId and gameId'
						);
					}
					webSocketGateway.handlePlayerReadyChange(
						data.payload.playerId,
						data.payload.gameId
					);
					break;

				case 'startGame':
					if (!isStartGameMessage(data)) {
						throw new Error(
							'Invalid startGame message: payload must contain playerId and gameId'
						);
					}
					webSocketGateway.handleStartGame(data.payload.playerId, data.payload.gameId);
					break;

				case 'makeTurn':
					if (!isMakeTurnMessage(data)) {
						throw new Error(
							'Invalid makeTurn message: payload must contain playerId, gameId, x and y'
						);
					}

					webSocketGateway.handleMakeTurn(
						data.payload.playerId,
						data.payload.gameId,
						data.payload.coord
					);
					break;

				case 'surrender':
					if (!isSurrenderMessage(data)) {
						throw new Error(
							'Invalid surrender message: payload must contain playerId and gameId'
						);
					}
					webSocketGateway.handleSurrender(data.payload.playerId, data.payload.gameId);
					break;

				case 'resetGame':
					if (!isResetGameMessage(data)) {
						throw new Error(
							'Invalid resetGame message: payload must contain playerId and gameId'
						);
					}
					webSocketGateway.handleResetGame(data.payload.playerId, data.payload.gameId);
					break;

				case 'exitGame':
					if (!isExitGameMessage(data)) {
						throw new Error(
							'Invalid exitGame message: payload must contain playerId and gameId'
						);
					}

					webSocketGateway.handleExitGame(data.payload.playerId, data.payload.gameId);
					break;

				default:
					throw new Error(`Unknown event: ${data.event}`);
			}
		} catch (error) {
			console.error('Error processing message:', error);

			const errorMessageText = error instanceof Error ? error.message : 'Unknown error';
			const errorMessage: ErrorMessage = {
				event: 'error',
				payload: errorMessageText,
			};
			ws.send(JSON.stringify(errorMessage));
		}
	});

	ws.on('pong', () => {
		webSocketGateway.handlePong(ws);
	});

	ws.on('close', (code) => {
		console.log(`WebSocket closed. Code: ${code}`);

		webSocketGateway.handleClientDisconnect(ws);
	});
});
