import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Redirect, Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import { useAuthStore } from "../src/store/authStore";
import "./global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { isAuthenticated, isLoading, _hasHydrated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  const inAuthGroup = segments[0] === "login";

  if (!_hasHydrated || !navigationState?.key) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {!isAuthenticated && !inAuthGroup && <Redirect href="/login" />}
      {isAuthenticated && inAuthGroup && <Redirect href="/" />}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="detail" />
        <Stack.Screen name="login" options={{ presentation: 'modal' }} />
      </Stack>
    </QueryClientProvider>
  );
}
