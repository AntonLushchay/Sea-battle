import path from 'path';

import { defineConfig } from 'vite';

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@sea-battle/shared': path.resolve(__dirname, '../shared/src'),
		},
	},
});
