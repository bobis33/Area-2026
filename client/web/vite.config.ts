import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.VITE_PORT),
    strictPort: true,
    host: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react-native": "react-native-web",
      "react-native-safe-area-context": path.resolve(
        __dirname,
        "./src/mocks/safe-area-context.ts",
      ),
    },
  },
  optimizeDeps: {
    include: ["@area/ui"],
    exclude: ["react-native-safe-area-context"],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
