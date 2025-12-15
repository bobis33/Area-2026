/**
 * Mock for react-native-safe-area-context on web
 * Provides dummy implementations for components and hooks that aren't needed on web
 */

import React from "react";

export const SafeAreaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return React.createElement(React.Fragment, null, children);
};

export const SafeAreaView: React.FC<{
  children: React.ReactNode;
  style?: any;
}> = ({ children, style }) => {
  return React.createElement("div", { style }, children);
};

export const useSafeAreaInsets = () => ({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});

export const useSafeAreaFrame = () => ({
  x: 0,
  y: 0,
  width: typeof window !== "undefined" ? window.innerWidth : 0,
  height: typeof window !== "undefined" ? window.innerHeight : 0,
});

export default {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
  useSafeAreaFrame,
};
