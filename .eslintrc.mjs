import js from '@eslint/js';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';

export default [
	{
		ignores: ['public/**/*', 'node_modules/**/*', '*.mjs'],
	},
	{
		files: ['**/*.{js,ts}'],
		plugins: {
			import: importPlugin,
			prettier: prettierPlugin,
			'@typescript-eslint': typescriptPlugin,
		},
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				project: './tsconfig.json', // Важно для правил, требующих инфо о типах
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		rules: {
			// Включаем рекомендованные правила
			...js.configs.recommended.rules,
			...typescriptPlugin.configs['recommended'].rules,

			// Ваши правила (они отлично подходят и для TS)
			'no-var': 'error',
			'prefer-const': 'error',
			eqeqeq: ['error', 'always'],
			'no-console': 'warn',

			// Правила импорта (с настройкой для TS)
			'import/order': [
				'error',
				{
					groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
					'newlines-between': 'always',
					alphabetize: { order: 'asc', caseInsensitive: true },
				},
			],

			// Отключаем правило, так как TypeScript сам справляется с этим
			'import/no-unresolved': 'off',

			// Интеграция с Prettier
			'prettier/prettier': 'warn',
		},
		settings: {
			'import/resolver': {
				typescript: true,
				node: true,
			},
		},
	},
	// Конфигурация Prettier должна идти последней
	prettierConfig,
];
