import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryProvider } from "./QueryProvider";

interface AppProviderProps {
	children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps): React.JSX.Element => {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<QueryProvider>{children}</QueryProvider>
		</GestureHandlerRootView>
	);
};
