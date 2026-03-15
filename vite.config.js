import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    lib: {
      entry: "./src/sdk-entry.jsx",
      name: "TeseraktoShopSDK",
      formats: ["es"],
      fileName: (format) => `teserakto-shop.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      plugins: [peerDepsExternal()],
    },
  },
});
