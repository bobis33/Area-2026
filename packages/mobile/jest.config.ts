import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-expo',
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.(ts|tsx|js|jsx)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|expo-router|expo-modules-core|react-native-reanimated|react-native-worklets|react-native-gesture-handler)/)',
  ],
};

export default config;
