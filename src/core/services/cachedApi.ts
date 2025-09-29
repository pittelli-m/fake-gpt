import { MockApiService } from "./mockApi";
import type { ApiResponse, Topic } from "../types";

export class CachedApiService extends MockApiService {
	private cache = new Map<string, { data: unknown; timestamp: number }>();
	private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

	async getTopics(): Promise<ApiResponse<Topic[]>> {
		const cacheKey = "topics";
		const cached = this.cache.get(cacheKey);

		if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
			return {
				data: cached.data as Topic[],
				success: true,
				timestamp: new Date(cached.timestamp),
				networkSim: { isSlowConnection: false, delay: 0, willFail: false, retryCount: 0 },
			};
		}

		const response = await super.getTopics();

		if (response.success) {
			this.cache.set(cacheKey, {
				data: response.data,
				timestamp: Date.now(),
			});
		}

		return response;
	}

	async getBotResponse(topicId: string): Promise<ApiResponse<string>> {
		const cacheKey = `bot_response_${topicId}`;
		const cached = this.cache.get(cacheKey);

		if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
			return {
				data: cached.data as string,
				success: true,
				timestamp: new Date(cached.timestamp),
				networkSim: { isSlowConnection: false, delay: 0, willFail: false, retryCount: 0 },
			};
		}

		const response = await super.getBotResponse(topicId);

		if (response.success) {
			this.cache.set(cacheKey, {
				data: response.data,
				timestamp: Date.now(),
			});
		}

		return response;
	}

	clearCache(): void {
		this.cache.clear();
	}
}

export const cachedApi = new CachedApiService();
