import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            input: {
                background: resolve(__dirname, 'src/background/serviceWorker.ts'),
                content: resolve(__dirname, 'src/content/contentScript.ts'),
                sidebar: resolve(__dirname, 'src/ui/sidebar/index.html'),
                popup: resolve(__dirname, 'src/ui/popup/index.html'),
                options: resolve(__dirname, 'src/ui/options/index.html'),
            },
            output: {
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].[ext]',
            },
        },
        outDir: 'dist',
        emptyOutDir: true,
    },
});
