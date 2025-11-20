import path from 'path';

import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		host: '0.0.0.0',
		port: 5173,
		strictPort: true,
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@sea-battle/shared': path.resolve(__dirname, '../shared/src'),
		},
	},
});
