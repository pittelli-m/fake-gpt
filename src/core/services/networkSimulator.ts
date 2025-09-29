import { APP_CONFIG } from "../constants/config";
import type { NetworkSimulation, ConnectionQuality } from "../types";

type DemoScenario = "normal" | "slow" | "fail" | null;

interface NetworkSimulatorConfig {
	slowConnectionChance: number;
	temporaryFailureChance: number;
	slowConnectionDelay: [number, number];
	retryAttempts: number;
	demoMode: DemoScenario;
}

class NetworkSimulator {
	private config: NetworkSimulatorConfig = {
		slowConnectionChance: APP_CONFIG.network.slowConnectionChance,
		temporaryFailureChance: APP_CONFIG.network.temporaryFailureChance,
		slowConnectionDelay: APP_CONFIG.network.slowConnectionDelay,
		retryAttempts: APP_CONFIG.network.retryAttempts,
		demoMode: null,
	};

	setDemoMode(scenario: DemoScenario): void {
		this.config.demoMode = scenario;
	}

	getConfig(): NetworkSimulatorConfig {
		return { ...this.config };
	}

	setConfig(config: Partial<NetworkSimulatorConfig>): void {
		this.config = { ...this.config, ...config };
	}

	async simulateRequest(): Promise<NetworkSimulation> {
		// Demo mode overrides
		if (this.config.demoMode) {
			switch (this.config.demoMode) {
				case "normal":
					return {
						isSlowConnection: false,
						delay: 100,
						willFail: false,
						retryCount: 0,
					};
				case "slow":
					return {
						isSlowConnection: true,
						delay: 2000,
						willFail: false,
						retryCount: 0,
					};
				case "fail":
					throw new Error("Simulated network failure");
			}
		}

		const isSlowConnection = Math.random() < this.config.slowConnectionChance;
		const willFail = Math.random() < this.config.temporaryFailureChance;

		if (willFail) {
			throw new Error("Network request failed");
		}

		let delay = 100;

		if (isSlowConnection) {
			const [min, max] = this.config.slowConnectionDelay;
			delay = Math.floor(Math.random() * (max - min) + min);
		}

		return {
			isSlowConnection,
			delay,
			willFail: false,
			retryCount: 0,
		};
	}
}

export const networkSimulator = new NetworkSimulator();

export const simulateNetwork = async (): Promise<NetworkSimulation> => {
	const { demoModeService } = await import("./demoModeService");

	if (demoModeService.isNormalMode()) {
		return {
			isSlowConnection: false,
			delay: 100,
			willFail: false,
			retryCount: 0,
		};
	}
	if (demoModeService.shouldSimulateDelay()) {
		const [min, max] = APP_CONFIG.network.slowConnectionDelay;
		const delay = Math.floor(Math.random() * (max - min) + min);
		return {
			isSlowConnection: true,
			delay,
			willFail: false,
			retryCount: 0,
		};
	}

	if (demoModeService.shouldSimulateFailure()) {
		demoModeService.incrementRetryCount();
		return {
			isSlowConnection: false,
			delay: 100,
			willFail: true,
			retryCount: 0,
		};
	}

	return {
		isSlowConnection: false,
		delay: 100,
		willFail: false,
		retryCount: 0,
	};
};

export const simulateStreamingDelay = (char: string): number => {
	if (/[.!?]/.test(char)) {
		return APP_CONFIG.streaming.punctuationPause;
	}

	if (/[{}();]/.test(char)) {
		return APP_CONFIG.streaming.codeSpeed;
	}

	return APP_CONFIG.streaming.baseSpeed;
};

export const detectConnectionQuality = (): ConnectionQuality => {
	const random = Math.random();

	if (random < 0.6) return "fast";
	if (random < 0.85) return "slow";
	return "poor";
};

export const getQualityMultiplier = (quality: ConnectionQuality): number => {
	switch (quality) {
		case "fast":
			return 1;
		case "slow":
			return 2.5;
		case "poor":
			return 5;
	}
};

export const calculateRetryDelay = (attempt: number): number => {
	return Math.min(1000 * 2 ** attempt, 30000);
};

export const shouldRetry = (_error: unknown, attempt: number): boolean => {
	return attempt < APP_CONFIG.network.retryAttempts;
};
