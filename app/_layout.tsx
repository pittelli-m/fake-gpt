import "../global.css";
import React from "react";
import { Stack } from "expo-router";
import { AppProvider } from "../src/providers/AppProvider";

const RootLayout = (): React.JSX.Element => {
	return (
		<AppProvider>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="index" />
				<Stack.Screen name="splash" />
				<Stack.Screen name="chat" />
			</Stack>
		</AppProvider>
	);
};

export default RootLayout;
