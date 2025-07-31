import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Or use your IP directly: '192.168.1.x'
    port: 5173, // Optional: change the port if needed
  },
});
