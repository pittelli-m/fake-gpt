export const APP_CONFIG = {
	appName: "Mock Chat Bot",
	version: "1.0.0",
	streaming: {
		baseSpeed: 30,
		codeSpeed: 20,
		punctuationPause: 300,
		thinkingDelay: 1000,
		interruptible: true,
	},
	network: {
		slowConnectionChance: 0.4,
		temporaryFailureChance: 0.2,
		slowConnectionDelay: [1000, 3000] as [number, number],
		retryAttempts: 3,
	},
	cache: {
		maxResponses: 20,
		cacheCode: true,
		preloadTopics: true,
	},
} as const;
