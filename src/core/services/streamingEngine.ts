interface StreamingOptions {
	content: string;
	onChunk: (chunk: string) => void;
	onComplete: () => void;
	speed?: "slow" | "normal" | "fast";
	interruptible?: boolean;
}

export class StreamingEngine {
	private isStreaming = false;
	private shouldStop = false;
	private currentTimeout: NodeJS.Timeout | null = null;

	async startStreaming({
		content,
		onChunk,
		onComplete,
		speed = "normal",
		interruptible = true,
	}: StreamingOptions): Promise<void> {
		if (this.isStreaming && !interruptible) return;

		this.stop();
		this.isStreaming = true;
		this.shouldStop = false;

		const hasCodeBlocks = content.includes("```");

		if (hasCodeBlocks) {
			await this.streamWithCodeBlocks(content, onChunk, onComplete, speed);
		} else {
			await this.streamWords(content, onChunk, onComplete, speed);
		}

		if (!this.shouldStop) {
			onComplete();
		}

		this.isStreaming = false;
	}

	private async streamWords(
		content: string,
		onChunk: (chunk: string) => void,
		_onComplete: () => void,
		speed: string,
	): Promise<void> {
		const baseSpeed = this.getBaseSpeed(speed, content.length);
		const words = content.split(" ");

		for (let i = 0; i < words.length && !this.shouldStop; i++) {
			const word = i === 0 ? words[i] : ` ${words[i]}`;
			const delay = this.calculateDelay(word, baseSpeed);

			await new Promise<void>((resolve): void => {
				this.currentTimeout = setTimeout((): void => {
					if (!this.shouldStop) {
						onChunk(word);
					}
					resolve();
				}, delay);
			});
		}
	}

	private async streamWithCodeBlocks(
		content: string,
		onChunk: (chunk: string) => void,
		_onComplete: () => void,
		speed: string,
	): Promise<void> {
		const baseSpeed = this.getBaseSpeed(speed, content.length);

		const parts = content.split(/(```[\s\S]*?```)/);

		for (const part of parts) {
			if (this.shouldStop) break;

			if (part.startsWith("```")) {
				const lines = part.split("\n");
				for (let i = 0; i < lines.length && !this.shouldStop; i++) {
					const line = i === 0 ? lines[i] : "\n" + lines[i];
					await new Promise<void>((resolve): void => {
						this.currentTimeout = setTimeout((): void => {
							if (!this.shouldStop) {
								onChunk(line);
							}
							resolve();
						}, baseSpeed * 0.5);
					});
				}
			} else {
				const words = part.split(" ");
				for (let i = 0; i < words.length && !this.shouldStop; i++) {
					const word = i === 0 ? words[i] : ` ${words[i]}`;
					if (word.trim()) {
						const delay = this.calculateDelay(word, baseSpeed);
						await new Promise<void>((resolve): void => {
							this.currentTimeout = setTimeout((): void => {
								if (!this.shouldStop) {
									onChunk(word);
								}
								resolve();
							}, delay);
						});
					}
				}
			}
		}
	}

	stop(): void {
		this.shouldStop = true;
		if (this.currentTimeout) {
			clearTimeout(this.currentTimeout);
			this.currentTimeout = null;
		}
		this.isStreaming = false;
	}

	isCurrentlyStreaming(): boolean {
		return this.isStreaming;
	}

	private getBaseSpeed(speed: string, contentLength: number): number {
		const lengthMultiplier = contentLength > 500 ? 0.5 : contentLength > 200 ? 0.7 : 1;

		switch (speed) {
			case "slow":
				return 80 * lengthMultiplier;
			case "fast":
				return 20 * lengthMultiplier;
			default:
				return 40 * lengthMultiplier;
		}
	}

	private calculateDelay(word: string, baseSpeed: number): number {
		if (/[.!?]$/.test(word)) return baseSpeed * 4;
		if (/[,;:]$/.test(word)) return baseSpeed * 2;
		if (word.length > 8) return baseSpeed * 1.2;

		return baseSpeed + Math.random() * 10;
	}
}

export const streamingEngine = new StreamingEngine();
