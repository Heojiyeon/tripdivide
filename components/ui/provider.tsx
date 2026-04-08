"use client";

import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { ColorModeProvider } from "./color-mode";

const system = createSystem(defaultConfig, {
  preflight: false,
});

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider forcedTheme="light">{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
