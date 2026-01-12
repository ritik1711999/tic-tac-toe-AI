import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Routes from "./Routes";
import { useAuthStore } from "./store/authStore";
import { SocketProvider } from "./lib/socket/SocketContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    },
  },
});

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <Routes />
      </SocketProvider>
    </QueryClientProvider>
  );
}

export default App;
