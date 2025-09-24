import js from '@eslint/js';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import promisePlugin from 'eslint-plugin-promise';

export default [
	{
		ignores: ['**/dist/**', '**/build/**', '**/node_modules/**'],
	},
	{
		files: ['packages/**/*.{ts,js}'],
		plugins: {
			import: importPlugin,
			prettier: prettierPlugin,
			'@typescript-eslint': typescriptPlugin,
			'unused-imports': unusedImportsPlugin,
			sonarjs: sonarjsPlugin,
			promise: promisePlugin,
		},
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				project: ['packages/*/tsconfig.json'], // Массив для monorepo
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		rules: {
			// --- БАЗОВЫЕ НАБОРЫ ПРАВИЛ ---
			// [Core ESLint] Базовый набор для поиска вероятных ошибок.
			...js.configs.recommended.rules,
			// [@typescript-eslint] Базовые правила для синтаксиса TypeScript.
			...typescriptPlugin.configs['recommended'].rules,
			// [@typescript-eslint] Более строгие правила, использующие информацию о типах. Требуют `project` в `parserOptions`.
			...typescriptPlugin.configs['recommended-requiring-type-checking'].rules,
			// [SonarJS] Правила для поиска "запахов кода", багов и уязвимостей.
			...sonarjsPlugin.configs.recommended.rules,
			// [Promise] Лучшие практики для работы с промисами и async/await.
			...promisePlugin.configs.recommended.rules,
			// [Import] Правила для корректной работы import/export.
			...importPlugin.configs.recommended.rules,

			// --- ПРАВИЛА КАЧЕСТВА КОДА (СТИЛЬ И СОВРЕМЕННЫЙ СИНТАКСИС) ---
			// [Core ESLint] Уникальное правило. Не входит в 'recommended'. Требует `const` для переменных, которые не переназначаются.
			'prefer-const': 'error',
			// [Core ESLint] Уникальное правило. Предпочитает стрелочные функции для колбэков.
			'prefer-arrow-callback': 'error',
			// [Core ESLint] Уникальное правило. Требует использовать шаблонные строки вместо конкатенации.
			'prefer-template': 'error',
			// [Core ESLint] Уникальное правило. Требует использовать сокращенную запись для свойств и методов в объектах.
			'object-shorthand': 'error',
			// [Core ESLint] Уникальное правило. Предпочитает деструктуризацию для доступа к свойствам объектов и элементам массивов.
			'prefer-destructuring': 'error',

			// --- СТРОГИЕ ПРАВИЛА СРАВНЕНИЯ ---
			// [Core ESLint] Уникальное правило. Запрещает сравнение с null через `==` или `!=`.
			'no-eq-null': 'error',
			// [Core ESLint] Уникальное правило. Запрещает неявное приведение типов (например, `!!` или `+str`).
			'no-implicit-coercion': 'error',

			// --- ПРАВИЛА ДЛЯ ОТЛАДКИ И ПРОДАКШЕНА ---
			// [Core ESLint] Уникальное правило. Предупреждает о наличии `console.log` в коде.
			'no-console': 'warn',
			// [Core ESLint] Уникальное правило. Запрещает использование `alert`, `confirm`, и `prompt`.
			'no-alert': 'error',

			// --- ПРАВИЛА ДЛЯ НЕИСПОЛЬЗУЕМЫХ ИМПОРТОВ ---
			// [unused-imports] Уникальное правило. Основное правило плагина для поиска неиспользуемых импортов.
			'unused-imports/no-unused-imports': 'error',
			// [unused-imports] Уникальное правило. Улучшенная версия `no-unused-vars` с гибкой настройкой.
			'unused-imports/no-unused-vars': [
				'error',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_',
				},
			],
			// [@typescript-eslint] Переопределение. Отключает стандартное правило TypeScript, чтобы оно не конфликтовало с `unused-imports`. **Это важно.**
			'@typescript-eslint/no-unused-vars': 'off',

			// --- СТРОГИЕ ПРАВИЛА ИМПОРТОВ ---
			// [Import] Уникальное правило. Заставляет строго сортировать импорты по группам. Очень полезно для порядка в проекте.
			'import/order': [
				'error',
				{
					groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
					'newlines-between': 'always',
					alphabetize: { order: 'asc', caseInsensitive: true },
					pathGroups: [{ pattern: '@/**', group: 'internal', position: 'before' }],
					pathGroupsExcludedImportTypes: ['builtin'],
				},
			],
			// [Import] Переопределение. Отключает правило из `import/recommended`, так как TypeScript сам справляется с этой проверкой.
			'import/no-unresolved': 'off',
			// [Import] Уникальное правило. Находит модули, которые импортируются, но их экспорт нигде не используется.
			'import/no-unused-modules': 'error',

			// --- ДОПОЛНИТЕЛЬНЫЕ СТРОГИЕ ПРАВИЛА (ЧИТАЕМОСТЬ И НАДЕЖНОСТЬ) ---
			// [Core ESLint] Уникальное правило. Запрещает "магические числа" — числа, используемые без присваивания в константу.
			'no-magic-numbers': [
				'error',
				{
					ignore: [-1, 0, 1, 2],
					ignoreArrayIndexes: true,
					enforceConst: true,
					detectObjects: false,
				},
			],
			// [Core ESLint] Уникальное правило. Запрещает вложенные тернарные операторы, так как они усложняют чтение.
			'no-nested-ternary': 'error',
			// [Core ESLint] Уникальное правило. Запрещает ненужные тернарные операторы (например, `condition ? true : false`).
			'no-unneeded-ternary': 'error',
			// [Core ESLint] Уникальное правило. Запрещает `if` как единственное выражение в `else` блоке.
			'no-lonely-if': 'error',
			// [@typescript-eslint] Требует использовать Optional Chaining (`?.`) где это возможно.
			'@typescript-eslint/prefer-optional-chain': 'error',
			// [@typescript-eslint] Требует использовать Nullish Coalescing (`??`) вместо `||` для проверок на null/undefined.
			'@typescript-eslint/prefer-nullish-coalescing': 'error',

			// --- ПРАВИЛА ДЛЯ ФУНКЦИЙ ---
			// [Core ESLint] Уникальное правило. Требует писать функции как выражения (`const f = () => {}`), а не как объявления (`function f() {}`).
			'func-style': ['error', 'expression'],
			// [@typescript-eslint] Уникальное правило. Стилистическое правило для TypeScript, предпочитает `type` вместо `interface` для типов функций.
			'@typescript-eslint/prefer-function-type': 'error',
			// note: no separate core rule required to allow function expressions

			// --- ПРАВИЛА ДЛЯ ОБЪЕКТОВ И МАССИВОВ ---
			// [Core ESLint] Уникальное правило. Требует использовать spread-синтаксис (`...arr`) вместо `.apply()`.
			'prefer-spread': 'error',
			// [Core ESLint] Уникальное правило. Требует использовать rest-параметры (`...args`) вместо объекта `arguments`.
			'prefer-rest-params': 'error',

			// --- ИНТЕГРАЦИЯ С PRETTIER ---
			// [Prettier] Уникальное правило. Запускает Prettier как правило ESLint и сообщает об ошибках форматирования.
			'prettier/prettier': 'error',
		},
		settings: {
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
					project: ['packages/*/tsconfig.json'], // Массив для monorepo
				},
				node: true,
			},
			'import/parsers': {
				'@typescript-eslint/parser': ['.ts', '.tsx'],
			},
		},
	},
	// Спец-блок для конфигов без typed-linting
	{
		files: ['**/*config*.{js,ts,mjs}'],
		plugins: {
			import: importPlugin,
			prettier: prettierPlugin,
			'@typescript-eslint': typescriptPlugin,
		},
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				project: null, // Отключаем typed-linting для конфигов
			},
			globals: {
				...globals.node,
			},
		},
		rules: {
			...js.configs.recommended.rules,
			...typescriptPlugin.configs['recommended'].rules,
			'prettier/prettier': 'error',
			'prefer-const': 'error',
			'no-console': 'warn',
			// Отключаем правила, требующие информации о типах
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-floating-promises': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/await-thenable': 'off',
			'@typescript-eslint/no-array-delete': 'off',
		},
	},
	// Конфигурация Prettier должна идти последней
	prettierConfig,
];
