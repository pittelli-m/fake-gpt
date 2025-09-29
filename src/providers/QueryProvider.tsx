import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			gcTime: 10 * 60 * 1000,
			retry: (failureCount, error): boolean => {
				if (failureCount >= 3) return false;

				const errorMessage = error?.message?.toLowerCase() || "";
				if (errorMessage.includes("rate_limit")) return false;

				return true;
			},
			retryDelay: (attemptIndex): number => Math.min(1000 * 2 ** attemptIndex, 30000),
		},
		mutations: {
			retry: false,
		},
	},
});

interface QueryProviderProps {
	children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps): React.JSX.Element => {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export { queryClient };
