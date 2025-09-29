import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";

const SplashScreen = (): React.JSX.Element => {
	const router = useRouter();

	useEffect((): (() => void) => {
		const timer = setTimeout((): void => {
			router.replace("/chat");
		}, 2000);

		return (): void => clearTimeout(timer);
	}, [router]);

	return (
		<View className="flex-1 items-center justify-center bg-white">
			<Text className="text-3xl font-bold text-gray-800">FakeGPT</Text>
			<Text className="text-gray-600 mt-2">The Self-Explaining Implementation</Text>
			<Text className="text-gray-400 text-xs mt-4">v0.1-overengineered</Text>
		</View>
	);
};

export default SplashScreen;
