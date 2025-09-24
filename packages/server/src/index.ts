import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

console.log('Сервер запущен на порту 8080 и ждёт подключения...');

wss.on('connection', (ws) => {
	console.log('Клиент подключился');

	ws.send('Добро пожаловать!');

	ws.on('message', (message) => {
		console.log(`Получено сообщение: ${message}`);

		ws.send(`вы сказали: ${message}`);
	});

	ws.on('close', (code, reason) => {
		console.log('Closed:', code, reason.toString());
	});
});
