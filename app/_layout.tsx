import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

function KeyboardProviderComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export default function Layout() {
  return (
    <KeyboardProviderComponent>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaProvider>
    </KeyboardProviderComponent>
  );
}
