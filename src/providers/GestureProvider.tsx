import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface GestureProviderProps {
	children: React.ReactNode;
}

export const GestureProvider = ({ children }: GestureProviderProps): React.JSX.Element => {
	return <GestureHandlerRootView style={{ flex: 1 }}>{children}</GestureHandlerRootView>;
};
