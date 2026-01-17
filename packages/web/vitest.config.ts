import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'react-native': 'react-native-web',
      'react-native-safe-area-context': resolve(__dirname, './src/utils/safe-area-stub.tsx'),
      'react-native/Libraries/Utilities/codegenNativeComponent': resolve(__dirname, './src/utils/codegen-native-component-stub.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    include: ['tests/**/*.test.{ts,tsx}'],
  },
  optimizeDeps: {
    include: ['@area/ui'],
    exclude: ['react-native-safe-area-context'],
  },
});
