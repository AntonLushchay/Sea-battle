import { WebSocketServer } from 'ws';

import { webSocketGateway } from './gateway/websocket_gateway';
import {
	isCreateGameMessage,
	isJoinToGameMessage,
	isObjectWithEvent,
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

				// TODO: Добавить обработку остальных событий с type guard'ами
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
