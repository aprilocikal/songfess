import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      "/itunes": {
        target: "https://itunes.apple.com",
        changeOrigin: true,
        secure: true,

        // 🔥 KUNCI FIX DI SINI
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          Accept: "application/json",
        },

        rewrite: (path) => path.replace(/^\/itunes/, ""),
      },
    },
  },
});
