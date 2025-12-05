import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Isto ajuda a expor na rede local, opcional mas útil
    proxy: {
      "/api-artic": {
        target: "https://www.artic.edu/iiif/2",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-artic/, ""),
        secure: false,
        // AQUI ESTÁ O SEGREDO PARA APRESENTAR IMAGENS QUE O MUSEU BLOQUEIA ACESSO EXTERIOR:
        // Vamos fingir que somos um browser e que estamos no site deles
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Referer: "https://www.artic.edu/",
        },
      },
    },
  },
});
