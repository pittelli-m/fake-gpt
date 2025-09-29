import { UI_CONSTANTS } from "../../core/constants/ui";
import { TIMING } from "../../core/constants/timing";
import type { QuickReply } from "../../core/types";

export const addMessageWithLoading = (
	addMessage: (content: string, replies?: QuickReply[]) => void,
	content: string,
	replies?: QuickReply[],
	delay: number = TIMING.LOADING_DELAY,
): void => {
	addMessage(UI_CONSTANTS.LOADING_TEXT);

	setTimeout((): void => {
		addMessage(content, replies);
	}, delay);
};

export const getNetworkModeMessage = (mode: "normal" | "slow" | "fail"): string => {
	switch (mode) {
		case "normal":
			return `${UI_CONSTANTS.NETWORK_NORMAL_TEXT} mode activated. Pretending everything works perfectly`;
		case "slow":
			return `${UI_CONSTANTS.NETWORK_SLOW_TEXT} mode activated. Now I'll pretend to struggle with your requests. Acting!`;
		case "fail":
			return `${UI_CONSTANTS.NETWORK_FAIL_TEXT} mode activated. Watch me dramatically fail, then heroically recover!`;
		default:
			return "Network mode changed. Reality remains unchanged.";
	}
};

export const getNetworkTestResultMessage = (mode: "normal" | "slow" | "fail"): string => {
	switch (mode) {
		case "normal":
			return "It's almost like the data was already here...";
		case "slow":
			return "I counted to 2000 Mississippi.";
		case "fail":
			return "Failed successfully! First attempt: dramatic failure. Second attempt: triumphant success.";
		default:
			return "Network test completed. Results inconclusive, but the test itself worked  :)";
	}
};

export const getNetworkTestStartMessage = (mode: "normal" | "slow" | "fail"): string => {
	switch (mode) {
		case "normal":
			return `Testing ${UI_CONSTANTS.NETWORK_NORMAL_TEXT.toLowerCase()} network... (Spoiler: it will work)`;
		case "slow":
			return `Testing ${UI_CONSTANTS.NETWORK_SLOW_TEXT.toLowerCase()} network... Time to practice patience!`;
		case "fail":
			return `Testing network ${UI_CONSTANTS.NETWORK_FAIL_TEXT.toLowerCase()}... Preparing for dramatic failure...`;
		default:
			return "Testing network... Results may vary (but they won't, they're hardcoded)";
	}
};
