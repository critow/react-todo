import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
    // Для GitHub Pages: BASE_URL=/<repo>/ во время сборки
    base: process.env.BASE_URL || '/',
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
    },
});
