import { WebSocketServer } from 'ws';

import { webSocketGateway } from './gateway/websocket_gateway';
import {
	isCreateGameMessage,
	isJoinToGameMessage,
	isObjectWithEvent,
	isPlaceFleetMessage,
	isReconnectMessage,
	isUpdateSettingsMessage,
} from './utils/type_guards/type_guards';

const wss = new WebSocketServer({ port: 8080 });

console.log('Сервер запущен на порту 8080 и ждёт подключения...');

wss.on('connection', (ws) => {
	console.log(`Client connected`);

	ws.send(JSON.stringify({ event: 'connected', payload: 'Welcome to the Sea Battle server!' }));

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

				default:
					throw new Error(`Unknown event: ${data.event}`);
			}
		} catch (error) {
			console.error('Error processing message:', error);

			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			ws.send(JSON.stringify({ event: 'error', payload: { message: errorMessage } }));
		}
	});

	ws.on('close', (code, reason) => {
		console.log('Closed:', code, reason.toString());
	});
});
