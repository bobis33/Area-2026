import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, "../.."), '');

  return {
    plugins: [react()],
    server: {
      port: Number(env.WEB_CONTAINER_PORT || 8081),
      strictPort: true,
      host: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "react-native": "react-native-web",
        "react-native-safe-area-context": path.resolve(__dirname, "./src/utils/safe-area-stub.tsx"),
        "react-native/Libraries/Utilities/codegenNativeComponent": path.resolve(__dirname, "./src/utils/codegen-native-component-stub.ts")
      },
    },
    optimizeDeps: {
      include: ["@area/ui"],
      exclude: ["react-native-safe-area-context"]
    },
  };
});
