import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppSettingsProvider } from "../hooks/useAppSettings";
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
        <AppSettingsProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="triage" />
            <Stack.Screen name="guidance" />
          </Stack>
        </AppSettingsProvider>
      </SafeAreaProvider>
    </KeyboardProviderComponent>
  );
}
