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

// Elements for Update Settings (simple, no styles)
const boardSizeInput = document.querySelector<HTMLInputElement>('#boardSizeInput');
const firstPlayerSelect = document.querySelector<HTMLSelectElement>('#firstPlayerSelect');
const fleetConfigInput = document.querySelector<HTMLTextAreaElement>('#fleetConfigInput');
const updateSettingsBtn = document.querySelector<HTMLButtonElement>('#updateSettingsBtn');
// Elements for placeFleet
const fleetPlacementInput = document.querySelector<HTMLTextAreaElement>('#fleetPlacementInput');
const placeFleetPlayerSelect = document.querySelector<HTMLSelectElement>('#placeFleetPlayerSelect');
const sendPlaceFleetBtn = document.querySelector<HTMLButtonElement>('#sendPlaceFleetBtn');

wss.onopen = () => {
	console.log(`Соединение с сервером установлено`);
};

let playerIdHost = '';
let playerIdGuest = '';
let gameId = '';

wss.onmessage = (event) => {
	const data = JSON.parse(event.data);

	// console.log('Received from server, event:', event);
	console.log('Received from server, data:', data);
	// console.log('Received from server, payload:', data.payload);

	if (data.event === 'gameCreated') {
		gameId = data.payload.gameId;
		playerIdHost = data.payload.myPlayerId;
		console.log(`Создана новая игра с ID: ${gameId}`);
	}

	if (data.event === 'gameJoined') {
		gameId = data.payload.gameId;
		playerIdGuest = data.payload.myPlayerId;
		console.log(`Присоединились к игре с ID: ${gameId} с игроком ID: ${playerIdGuest}`);
		console.dir(data.payload);
	}

	if (data.event === 'reconnected') {
		gameId = data.payload.gameId;
		playerIdHost = data.payload.myPlayerId;
		console.log(`Восстановлено соединение с игрой ID: ${gameId} с игроком ID: ${playerIdHost}`);
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
					playerId: playerIdHost,
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

// Send updateSettings using current playerId/gameId
if (updateSettingsBtn) {
	updateSettingsBtn.onclick = () => {
		if (!playerIdHost || !gameId) {
			console.warn('playerId/gameId пустые. Сначала создайте или войдите в игру.');
			return;
		}

		const settings: Record<string, unknown> = {};

		// boardSize: 5-20
		const sizeVal = boardSizeInput?.value.trim();
		if (sizeVal) {
			const parsed = Number(sizeVal);
			settings.boardSize = parsed;
			// if (!Number.isNaN(parsed) && parsed >= 5 && parsed <= 20) {
			// 	settings.boardSize = parsed;
			// } else {
			// 	console.warn('boardSize вне диапазона (5-20); игнорируем');
			// }
		}

		// firstPlayer: PLAYER_1 | PLAYER_2 | RANDOM
		const fp = firstPlayerSelect?.value as string | undefined;
		if (fp === 'PLAYER_1' || fp === 'PLAYER_2' || fp === 'RANDOM') {
			settings.firstPlayer = fp;
		}

		// fleetConfig: JSON array of {type,size,count}
		const fleetText = fleetConfigInput?.value.trim();
		if (fleetText) {
			try {
				const arr = JSON.parse(fleetText);
				if (Array.isArray(arr)) {
					settings.fleetConfig = arr;
				} else {
					console.warn('fleetConfig должен быть JSON-массивом');
				}
			} catch {
				console.warn('Некорректный JSON в fleetConfig; игнорируем');
			}
		}

		const message = {
			event: 'updateSettings',
			payload: {
				playerId: playerIdHost,
				gameId: gameId,
				settings,
			},
		};

		wss.send(JSON.stringify(message));
		console.log('отправили updateSettings на сервер:', message);
	};
}

// Send placeFleet (fleet placement) using chosen player (host or guest)
if (sendPlaceFleetBtn) {
	sendPlaceFleetBtn.onclick = () => {
		if (!gameId) {
			console.warn('gameId пустой. Сначала создайте или войдите в игру.');
			return;
		}
		const playerSelection = placeFleetPlayerSelect?.value || 'host';
		const chosenPlayerId = playerSelection === 'guest' ? playerIdGuest : playerIdHost;
		if (!chosenPlayerId) {
			console.warn('Выбранный playerId пуст. Возможно игрок еще не создан/не присоединился.');
			return;
		}
		const raw = fleetPlacementInput?.value.trim();
		if (!raw) {
			console.warn('Введите JSON для размещения флота.');
			return;
		}
		let fleet: unknown;
		try {
			fleet = JSON.parse(raw);
		} catch (e) {
			console.warn('Некорректный JSON в поле fleet placements:', e);
			return;
		}
		if (!Array.isArray(fleet)) {
			console.warn('Fleet placements должен быть массивом.');
			return;
		}
		// Быстрая валидация элементов
		for (let i = 0; i < fleet.length; i++) {
			const item = fleet[i];
			if (typeof item !== 'object' || item === null) {
				console.warn(`Элемент флота ${i} не объект`);
				return;
			}
			const { shipId, startCoords, orientation } = item as {
				shipId?: unknown;
				startCoords?: { x?: unknown; y?: unknown };
				orientation?: unknown;
			};
			if (typeof shipId !== 'string') {
				console.warn(`shipId в элементе ${i} должен быть строкой`);
				return;
			}
			if (
				!startCoords ||
				typeof startCoords.x !== 'number' ||
				typeof startCoords.y !== 'number'
			) {
				console.warn(`startCoords в элементе ${i} должен иметь числовые x,y`);
				return;
			}
			if (orientation !== 'horizontal' && orientation !== 'vertical') {
				console.warn(`orientation в элементе ${i} должен быть 'horizontal' или 'vertical'`);
				return;
			}
		}
		const message = {
			event: 'placeFleet',
			payload: {
				gameId,
				playerId: chosenPlayerId,
				fleet,
			},
		};
		wss.send(JSON.stringify(message));
		console.log('отправили placeFleet на сервер:', message);
	};
}

// когда теряется сеть и игрок хочет реконектнуться, нужно нажать кнопку recconect и тогда клиент проверит localstorage и попробует приконектиться к сохранненой сессии. Если в localstorage несколько сессий то выводится выбор к какой сессии подключиться. В localstorege пусть хронятся playerId и gameId. А если сессий нет выводить ошибку.
