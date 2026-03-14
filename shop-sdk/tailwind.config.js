import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/sdk-entry.jsx'),
      name: 'TeseraktoShopSDK',
      fileName: (format) => `shop-sdk.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'], // don’t bundle react
    },
  },
});
