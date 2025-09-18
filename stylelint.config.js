// Простой Stylelint конфиг для SCSS
export default {
	extends: [
		'stylelint-config-standard-scss', // Стандартные правила для SCSS
		'stylelint-config-prettier-scss', // Интеграция с Prettier
	],
	rules: {
		// === ОСНОВНЫЕ ПРАВИЛА ===
		// Цвета
		'color-named': 'never', // Запрет именованных цветов (red, blue)

		// Единицы измерения
		'unit-allowed-list': ['px', 'em', 'rem', '%', 'vh', 'vw', 's', 'ms', 'fr'], // Добавили 'fr' для CSS Grid
		'length-zero-no-unit': true, // 0 без единиц (0px -> 0)

		// Селекторы
		'selector-class-pattern': [
			'^[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$',
			{
				message: 'Ожидается BEM-подобный kebab-case (например, a-block__element--modifier)',
			},
		],
		'selector-id-pattern': [
			'^[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$',
			{
				message: 'Ожидается BEM-подобный kebab-case (например, a-block__element--modifier)',
			},
		],

		//SCSS переменные
		'scss/dollar-variable-pattern': '^[a-z][a-zA-Z0-9]*$', // allow camelCase

		// SCSS специфичные правила
		'scss/at-rule-no-unknown': true, // Проверка SCSS директив

		// Предупреждения вместо ошибок
		// 'declaration-no-important': 'warn', // Предупреждение о !important
	},
	files: ['packages/client/**/*.{scss,css}'],
	ignoreFiles: ['**/dist/**', '**/build/**', '**/node_modules/**'],
};
