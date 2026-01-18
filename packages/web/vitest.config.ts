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
      '@area/ui': resolve(__dirname, '../ui/src/index.ts'),
    },
    conditions: ['react-native', 'default'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    include: ['tests/**/*.test.{ts,tsx}'],
    server: {
      deps: {
        inline: ['@area/ui'],
      },
    },
  },
});
