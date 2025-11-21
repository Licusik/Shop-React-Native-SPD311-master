import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDatabase } from "./database/db";

export default function RootLayout() {
  useEffect(() => {
    initDatabase().catch((error: Error) => {
      console.error("Failed to initialize database:", error);
    });
  }, []);

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ title: "Home", headerShown: false }}
      />
    </Stack>
  );
}