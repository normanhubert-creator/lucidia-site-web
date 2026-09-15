import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    // Les fichiers portent une empreinte dans leur nom : l'hébergeur peut
    // les mettre en cache indéfiniment, et une mise en ligne est visible
    // immédiatement puisque les noms changent.
    assetsDir: "assets",
    sourcemap: false,
  },
});
