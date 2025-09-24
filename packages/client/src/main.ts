import './styles.scss';

type buttonElem = HTMLElement | null;

let wss: WebSocket;

const createConectionButtonElem: buttonElem = document.getElementById('createConection');
const createLobbyButtonElem: buttonElem = document.getElementById('createLobby');
const deletLobbyButtonElem: buttonElem = document.getElementById('deletLobby');
const closeConectionButtonElem: buttonElem = document.getElementById('closeConection');

const input = document.querySelector<HTMLInputElement>('#sendMsgInput');
const button = document.querySelector<HTMLButtonElement>('#sendMsgBtn');

if (createConectionButtonElem) {
	createConectionButtonElem.onclick = () => {
		wss = new WebSocket('ws://localhost:8080');
		wss.onopen = (event) => console.log(`Соединение установлено`, event);
		wss.onmessage = (event) => console.log(`Получено сообщение:`, event);
		wss.onerror = (event) => console.log(`Ошибка`, event);
	};
}
if (createLobbyButtonElem) {
	createLobbyButtonElem.onclick = () => {};
}
if (deletLobbyButtonElem) {
	deletLobbyButtonElem.onclick = () => {};
}
if (closeConectionButtonElem) {
	closeConectionButtonElem.onclick = () => {
		wss.close();
		wss.onclose = (event) => console.log(`Соединение закрыто`, event);
	};
}

if (button) {
	button.onclick = () => {
		if (input) {
			wss.send(input.value);
			console.log(`отправили с клиента на сервер: ${input.value}`);
			input.value = '';
		}
	};
}
