import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vitest đọc chung config này (khối `test`)
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
  },
});
