import './style.scss';
import { getButton } from './components/button/batton';

const rootDiv = document.querySelector('#app')!;

rootDiv.innerHTML = `
	<section>
		${getButton()}
		${getButton()}
		${getButton()}
	<section>
	`;
