import './styles.scss';

type buttonElem = HTMLElement | null;

const websocketURL = import.meta.env.VITE_WEBSOCKET_URL.replace('{host}', window.location.hostname);

const wss: WebSocket = new WebSocket(websocketURL);

const createGameButtonElem: buttonElem = document.getElementById('createGame');
const deleteGameButtonElem: buttonElem = document.getElementById('deleteGame');
const closeConnectionButtonElem: buttonElem = document.getElementById('closeConnection');

const gameIdInput = document.querySelector<HTMLInputElement>('#gameIdInput');
const joinToGameButton = document.querySelector<HTMLButtonElement>('#joinToGame');

const gameIdForReconnectInput = document.querySelector<HTMLInputElement>(
	'#gameIdForReconnectInput'
);
const reconnectToGameButton = document.querySelector<HTMLButtonElement>('#reconnectToGame');

wss.onopen = () => {
	console.log(`Соединение с сервером установлено`);
};

let playerId = '';
let gameId = '';

wss.onmessage = (event) => {
	const data = JSON.parse(event.data);

	// console.log('Received from server, event:', event);
	// console.log('Received from server, data:', data);
	// console.log('Received from server, payload:', data.payload);

	if (data.event === 'gameCreated') {
		gameId = data.payload.gameId;
		playerId = data.payload.myPlayerId;
		console.log(`Создана новая игра с ID: ${gameId}`);
	}

	if (data.event === 'gameJoined') {
		gameId = data.payload.gameId;
		playerId = data.payload.myPlayerId;
		console.log(`Присоединились к игре с ID: ${gameId} с игроком ID: ${playerId}`);
		console.dir(data.payload);
	}

	if (data.event === 'reconnected') {
		gameId = data.payload.gameId;
		playerId = data.payload.myPlayerId;
		console.log(`Восстановлено соединение с игрой ID: ${gameId} с игроком ID: ${playerId}`);
	}

	if (data.event === 'error') {
		console.error(`Ошибка от сервера: ${JSON.stringify(data.payload)}`);
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
					id: gameIdInput.value,
				},
			};
			wss.send(JSON.stringify(message));
			console.log(`отправили с клиента на сервер: ${JSON.stringify(message)}`);
			gameIdInput.value = '';
		}
	};
}

if (reconnectToGameButton) {
	reconnectToGameButton.onclick = () => {
		if (gameIdForReconnectInput) {
			const message = {
				event: 'reconnect',
				payload: {
					playerId: playerId,
					gameId: gameIdForReconnectInput.value,
				},
			};
			wss.send(JSON.stringify(message));
			console.log(`отправили с клиента на сервер: ${JSON.stringify(message)}`);
			gameIdForReconnectInput.value = '';
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

// когда теряется сеть и игрок хочет реконектнуться, нужно нажать кнопку recconect и тогда клиент проверит localstorage и попробует приконектиться к сохранненой сессии. Если в localstorage несколько сессий то выводится выбор к какой сессии подключиться. В localstorege пусть хронятся playerId и gameId. А если сессий нет выводить ошибку.
