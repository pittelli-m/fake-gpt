import { BOT_RESPONSES, BOT_TOPICS } from "../content";
import { simulateNetwork } from "./networkSimulator";
import type { ApiResponse, Topic, Message } from "../types";

export class MockApiService {
	async getTopics(): Promise<ApiResponse<Topic[]>> {
		const simulation = await simulateNetwork();

		if (simulation.willFail) {
			const error = new Error("Failed to fetch topics");
			throw error;
		}

		// Simulate network delay
		await new Promise((resolve): NodeJS.Timeout => setTimeout(resolve, simulation.delay));

		return {
			data: BOT_TOPICS,
			success: true,
			networkSim: simulation,
			timestamp: new Date(),
		};
	}

	async getBotResponse(topicId: string): Promise<ApiResponse<string>> {
		const simulation = await simulateNetwork();

		if (simulation.willFail) {
			const error = new Error("Failed to get bot response");
			throw error;
		}

		// Simulate network delay
		await new Promise((resolve): NodeJS.Timeout => setTimeout(resolve, simulation.delay));

		const response = BOT_RESPONSES[topicId] || "Sorry, I don't have information about that topic.";

		return {
			data: response,
			success: true,
			networkSim: simulation,
			timestamp: new Date(),
		};
	}
}

export const createUserMessage = (content: string): Message => ({
	id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
	type: "user",
	content,
	timestamp: new Date(),
});

export const createBotMessage = (content: string, isStreaming = false): Message => ({
	id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
	type: "bot",
	content,
	timestamp: new Date(),
	isStreaming,
});

export const mockApi = new MockApiService();
