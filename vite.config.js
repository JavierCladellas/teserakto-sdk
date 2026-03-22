import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    cssCodeSplit: false, // Forces all CSS into a single file
    lib: {
      entry: "./src/sdk-entry.jsx",
      name: "TeseraktoShopSDK",
      formats: ["es"],
      fileName: (format) => `teserakto-shop.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      plugins: [peerDepsExternal()],
      output: {
        assetFileNames: (assetInfo) => {
          // Look for ANY CSS file and force the exact name you need
          const isCss = assetInfo.name?.endsWith('.css') || 
                       (assetInfo.names && assetInfo.names.some(n => n.endsWith('.css')));
          
          if (isCss) {
            return "teserakto-shop.css";
          }
          
          // For anything else (like images/fonts), output without a hash
          return "[name][extname]"; 
        },
      },
    },
  },
});