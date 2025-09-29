import { Platform, Dimensions } from "react-native";

export const platformUtils = {
	isIOS: Platform.OS === "ios",
	isAndroid: Platform.OS === "android",
	isWeb: Platform.OS === "web",

	screenWidth: Dimensions.get("window").width,
	screenHeight: Dimensions.get("window").height,

	getElevation: (elevation: number): object =>
		Platform.select({
			ios: { shadowOpacity: 0.1, shadowRadius: elevation },
			android: { elevation },
			default: {},
		}) || {},

	getKeyboardOffset: (): number =>
		Platform.select({
			ios: 0,
			android: 20,
			default: 0,
		}),

	getSafeAreaPadding: (): string =>
		Platform.select({
			ios: "pt-safe-top pb-safe-bottom",
			android: "pt-4 pb-4",
			default: "pt-4 pb-4",
		}),

	getPrimaryColor: (): string =>
		Platform.select({
			ios: "#007AFF",
			android: "#6200EE",
			default: "#3B82F6",
		}),

	getSystemFont: (): string =>
		Platform.select({
			ios: "San Francisco",
			android: "Roboto",
			default: "system",
		}),
};
