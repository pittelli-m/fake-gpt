import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { cachedApi } from "../../../core/services/cachedApi";
import { streamingEngine } from "../../../core/services/streamingEngine";
import type { ApiResponse } from "../../../core/types";

interface BotResponseInput {
	topicId: string;
	onStreamingStart?: (messageId: string) => void;
	onStreamingChunk?: (chunk: string) => void;
	onStreamingComplete?: () => void;
}

interface BotResponseOutput {
	response: string;
	messageId: string;
}

export const useBotResponse = (): UseMutationResult<BotResponseOutput, Error, BotResponseInput> => {
	return useMutation({
		mutationFn: async ({
			topicId,
			onStreamingStart,
			onStreamingChunk,
			onStreamingComplete,
		}: BotResponseInput): Promise<BotResponseOutput> => {
			const messageId = `bot-${Date.now()}`;

			onStreamingStart?.(messageId);

			const apiResponse: ApiResponse<string> = await cachedApi.getBotResponse(topicId);
			const fullResponse = apiResponse.data;

			if (onStreamingChunk) {
				await streamingEngine.startStreaming({
					content: fullResponse,
					onChunk: (chunk: string): void => {
						onStreamingChunk(chunk);
					},
					onComplete: (): void => {
						// Streaming complete
					},
					speed: fullResponse.length > 500 ? "fast" : "normal",
					interruptible: true,
				});
			}

			onStreamingComplete?.();

			return {
				response: fullResponse,
				messageId,
			};
		},
		retry: (failureCount, error): boolean => {
			if (failureCount >= 2) return false;

			const errorMessage = error?.message?.toLowerCase() || "";
			return !errorMessage.includes("rate_limit");
		},
		retryDelay: 1000,
	});
};
