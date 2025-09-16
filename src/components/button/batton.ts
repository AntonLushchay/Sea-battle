import styles from './button.module.scss';

export function getButton(): string {
    return `<button class=${styles.one}>123</button>
	<button class=${styles.two}>456</button>`;
}
