import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // URL del servidor de destino
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Elimina la parte '/api' de la URL
      },
    },
  },
  plugins: [react()],
});
