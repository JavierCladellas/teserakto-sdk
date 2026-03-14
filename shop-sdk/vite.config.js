import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    lib: {
      entry: "./src/sdk-entry.jsx",
      name: "ShopWidget",
      fileName: (format) => `shop-widget.${format}.js`,
    },
    rollupOptions: {
      external: [],
    },
  },
});
