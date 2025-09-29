import type { Topic, Message } from "../types";

export const BOT_TOPICS: Topic[] = [
	{
		id: "architecture-overview",
		title: "Architecture Overview",
		description: "Learn about the clean architecture pattern used in this app",
		category: "architecture",
		estimatedReadTime: 3,
	},
	{
		id: "tanstack-query",
		title: "Why TanStack Query?",
		description: "Discover the benefits of using TanStack Query for state management",
		category: "technical",
		estimatedReadTime: 4,
	},
	{
		id: "network-simulation",
		title: "Network Simulation Demo",
		description: "See how the app handles slow connections and failures",
		category: "demo",
		estimatedReadTime: 2,
	},
	{
		id: "performance-optimizations",
		title: "Performance Optimizations",
		description: "FlashList, streaming, and memory management techniques",
		category: "performance",
		estimatedReadTime: 5,
	},
	{
		id: "platform-features",
		title: "Platform-Specific Features",
		description: "iOS and Android differences handled gracefully",
		category: "technical",
		estimatedReadTime: 3,
	},
	{
		id: "typescript-strictness",
		title: "TypeScript Strictness",
		description: "Zero 'any' types and comprehensive error handling",
		category: "technical",
		estimatedReadTime: 4,
	},
	{
		id: "streaming-animation",
		title: "Streaming Text Engine",
		description: "Character-by-character rendering with realistic delays",
		category: "demo",
		estimatedReadTime: 3,
	},
	{
		id: "network-demo",
		title: "Interactive Network Demo",
		description: "Force network scenarios and see real-time results",
		category: "demo",
		estimatedReadTime: 2,
	},
	{
		id: "performance-metrics",
		title: "Live Performance Metrics",
		description: "Real-time FPS, memory, and cache monitoring",
		category: "performance",
		estimatedReadTime: 3,
	},
];

export const BOT_RESPONSES: Record<string, string> = {
	"architecture-overview": `.. maybe`,
};

export const createUserMessage = (content: string): Message => ({
	id: `user-${Date.now()}`,
	type: "user",
	content,
	timestamp: new Date(),
});

export const createBotMessage = (
	content: string,
	isStreaming = false,
	topicId?: string,
): Message => {
	const message: Message = {
		id: `bot-${Date.now()}`,
		type: "bot",
		content,
		timestamp: new Date(),
		isStreaming,
	};
	if (topicId === "network-demo") {
		message.demoComponent = "network-demo";
	}

	return message;
};
