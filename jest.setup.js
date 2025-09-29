/* eslint-disable */

jest.mock("nativewind", () => ({
	styled: (component) => component,
}));

global.setImmediate = jest.useRealTimers;

jest.mock("expo-router", () => ({
	useRouter: () => ({
		push: jest.fn(),
		replace: jest.fn(),
		back: jest.fn(),
	}),
	useLocalSearchParams: () => ({}),
	Link: "Link",
}));

global.fetch = jest.fn();

const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
	console.warn = (...args) => {
		if (
			args[0]?.includes?.("useNativeDriver") ||
			args[0]?.includes?.("Animated") ||
			args[0]?.includes?.("componentWillReceiveProps")
		) {
			return;
		}
		originalWarn.apply(console, args);
	};

	console.error = (...args) => {
		if (args[0]?.includes?.("Warning:") || args[0]?.includes?.("ReactNativeFiberHostComponent")) {
			return;
		}
		originalError.apply(console, args);
	};
});

afterAll(() => {
	console.warn = originalWarn;
	console.error = originalError;
});
