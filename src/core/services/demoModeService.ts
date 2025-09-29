import type { DemoType } from "../types";
export class DemoModeService {
	private isDemoMode = false;
	private demoType: DemoType | null = null;
	private originalConfig: Record<string, unknown> | null = null; // Will store original network config
	private subscribers: Set<(enabled: boolean, type: DemoType | null) => void> = new Set();
	private networkMode: "normal" | "slow" | "fail" | null = null;
	private failRetryCount = 0;
	private maxRetries = 1; // Will be randomized 1-3

	enableDemoMode(type: DemoType): void {
		if (!this.isDemoMode) {
			this.originalConfig = this.getCurrentNetworkConfig();
		}

		this.isDemoMode = true;
		this.demoType = type;

		if (type === "network-normal") {
			this.networkMode = "normal";
		} else if (type === "network-slow") {
			this.networkMode = "slow";
		} else if (type === "network-fail") {
			this.networkMode = "fail";
			this.failRetryCount = 0;
			this.maxRetries = Math.floor(Math.random() * 3) + 1; // Random 1-3
		}

		this.applyDemoConfiguration(type);

		this.notifySubscribers(true, type);
	}

	disableDemoMode(): void {
		if (this.originalConfig) {
			this.restoreOriginalConfiguration();
		}

		const wasEnabled = this.isDemoMode;
		this.isDemoMode = false;
		this.demoType = null;
		this.originalConfig = null;
		this.networkMode = null;
		this.failRetryCount = 0;
		this.maxRetries = 1;

		if (wasEnabled) {
			this.notifySubscribers(false, null);
		}
	}

	isDemoActive(): boolean {
		return this.isDemoMode;
	}

	getDemoType(): DemoType | null {
		return this.demoType;
	}

	getDemoConfig(): { enabled: boolean; type: DemoType | null } | null {
		if (!this.isDemoMode || !this.demoType) {
			return null;
		}

		return {
			enabled: this.isDemoMode,
			type: this.demoType,
		};
	}

	shouldSimulateDelay(): boolean {
		return this.isDemoMode && this.networkMode === "slow";
	}

	shouldSimulateFailure(): boolean {
		if (!this.isDemoMode || this.networkMode !== "fail") {
			return false;
		}
		return this.failRetryCount < this.maxRetries;
	}

	incrementRetryCount(): void {
		if (this.networkMode === "fail") {
			this.failRetryCount++;
		}
	}

	resetRetryCount(): void {
		this.failRetryCount = 0;
		if (this.networkMode === "fail") {
			this.maxRetries = Math.floor(Math.random() * 3) + 1; // New random 1-3
		}
	}

	getNetworkMode(): string {
		if (!this.isDemoMode) return "normal";
		return this.networkMode || "normal";
	}

	isNormalMode(): boolean {
		return !this.isDemoMode || this.networkMode === "normal";
	}

	subscribe(callback: (enabled: boolean, type: DemoType | null) => void): () => void {
		this.subscribers.add(callback);

		callback(this.isDemoMode, this.demoType);

		return (): void => {
			this.subscribers.delete(callback);
		};
	}

	toggleDemo(type: DemoType): void {
		if (this.isDemoMode && this.demoType === type) {
			this.disableDemoMode();
		} else {
			this.enableDemoMode(type);
		}
	}

	private applyDemoConfiguration(type: DemoType): void {
		switch (type) {
			case "network-slow":
				this.configureSlowNetwork(3000);
				break;
			case "network-fail":
				this.configureFailingNetwork(1.0);
				break;
			case "network-normal":
				break;
		}
	}

	private configureSlowNetwork(delay: number): void {
		// eslint-disable-next-line no-console
		console.log(`Configuring slow network with ${delay}ms delay`);
	}

	private configureFailingNetwork(failureRate: number): void {
		// eslint-disable-next-line no-console
		console.log(`Configuring failing network with ${failureRate * 100}% failure rate`);
	}

	private getCurrentNetworkConfig(): Record<string, unknown> {
		return {
			demoModeIsolated: true,
			normalOperationPreserved: true,
		};
	}

	private restoreOriginalConfiguration(): void {
		if (this.originalConfig) {
			// eslint-disable-next-line no-console
			console.log("Restoring original network configuration");
		}
	}

	private notifySubscribers(enabled: boolean, type: DemoType | null): void {
		this.subscribers.forEach((callback): void => {
			try {
				callback(enabled, type);
			} catch (error: unknown) {
				// eslint-disable-next-line no-console
				console.error("Error in demo mode subscriber:", error);
			}
		});
	}
}

// Export singleton instance
export const demoModeService = new DemoModeService();
