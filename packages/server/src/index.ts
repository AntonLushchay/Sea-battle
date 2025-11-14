import { C2SMessage } from '@sea-battle/shared';
import { WebSocketServer } from 'ws';

import { webSocketGateway } from './gateway/websocket.gateway';

const wss = new WebSocketServer({ port: 8080 });

console.log('Сервер запущен на порту 8080 и ждёт подключения...');

wss.on('connection', (ws) => {
	console.log(`Client connected`);
	ws.send(JSON.stringify({ event: 'connected', payload: 'Welcome to the Sea Battle server!' }));

	ws.on('message', (message: string) => {
		try {
			const data: unknown = JSON.parse(message);

			if (typeof data !== 'object' || data === null || !('event' in data)) {
				throw new Error('Invalid message format');
			}

			const typedData = data as C2SMessage;

			switch (typedData.event) {
				case 'createGame':
					webSocketGateway.handleCreateGame(ws);
					break;

				case 'joinToGame':
					webSocketGateway.handleJoinGame(ws, typedData.payload);

					break;
				// TODO: Добавить обработку остальных событий
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
