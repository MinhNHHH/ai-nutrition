import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../src/store/authStore";
import "./global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { isAuthenticated, isLoading, _hasHydrated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated || isLoading) return;

    const inAuthGroup = segments[0] === "login";

    if (!isAuthenticated && !inAuthGroup) {
      // Small delay to ensure the navigator is ready
      const timeout = setTimeout(() => {
        router.replace("/login" as any);
      }, 1);
      return () => clearTimeout(timeout);
    } else if (isAuthenticated && inAuthGroup) {
      const timeout = setTimeout(() => {
        router.replace("/" as any);
      }, 1);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, segments, isLoading, _hasHydrated]);

  if (!_hasHydrated) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="detail" />
        <Stack.Screen name="login" options={{ presentation: 'modal' }} />
      </Stack>
    </QueryClientProvider>
  );
}
