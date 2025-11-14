import './styles.scss';

type buttonElem = HTMLElement | null;

const websocketURL = import.meta.env.VITE_WEBSOCKET_URL.replace('{host}', window.location.hostname);

const wss: WebSocket = new WebSocket(websocketURL);

const createGameButtonElem: buttonElem = document.getElementById('createGame');
const deleteGameButtonElem: buttonElem = document.getElementById('deleteGame');
const closeConnectionButtonElem: buttonElem = document.getElementById('closeConnection');

const gameIdInput = document.querySelector<HTMLInputElement>('#gameIdInput');
const joinToGameButton = document.querySelector<HTMLButtonElement>('#joinToGame');

wss.onopen = () => {
	console.log(`Соединение с сервером установлено`);
};

wss.onmessage = (event) => {
	const data = JSON.parse(event.data);

	// console.log('Received from server, event:', event);
	// console.log('Received from server, data:', data);
	// console.log('Received from server, payload:', data.payload);

	if (data.event === 'gameCreated') {
		const gameId = data.payload.gameId;
		console.log(`Создана новая игра с ID: ${gameId}`);
	}
	if (data.event === 'error') {
		console.error(`Ошибка от сервера: ${data.payload}`);
	}
};

if (createGameButtonElem) {
	createGameButtonElem.onclick = () => {
		const message = {
			event: 'createGame',
		};
		wss.send(JSON.stringify(message));
	};
}

if (joinToGameButton) {
	joinToGameButton.onclick = () => {
		if (gameIdInput) {
			const message = {
				event: 'joinToGame',
				payload: {
					gameId: gameIdInput.value,
				},
			};
			wss.send(JSON.stringify(message));
			console.log(`отправили с клиента на сервер: ${JSON.stringify(message)}`);
			gameIdInput.value = '';
		}
	};
}

if (deleteGameButtonElem) {
	deleteGameButtonElem.onclick = () => {
		const message = {
			event: 'deleteGame',
		};
		wss.send(JSON.stringify(message));
	};
}
if (closeConnectionButtonElem) {
	closeConnectionButtonElem.onclick = () => {
		wss.close();
		wss.onclose = () => console.log(`Соединение закрыто`);
	};
}
