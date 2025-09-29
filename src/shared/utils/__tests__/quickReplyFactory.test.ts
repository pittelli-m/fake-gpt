import {
	createMainTopicReplies,
	createNetworkTestReplies,
	createSubtopicReplies,
} from "../quickReplyFactory";
import { CHAT_CONTENT } from "../../../core/constants/topics";
import { UI_CONSTANTS } from "../../../core/constants/ui";

describe("Quick Reply Navigation Flow", (): void => {
	it("should create proper quick reply flow for user navigation", (): void => {
		const mainReplies = createMainTopicReplies();
		expect(mainReplies.length).toBe(CHAT_CONTENT.topics.length);

		const architectureTopic = CHAT_CONTENT.topics.find((t): boolean => t.id === "architecture");
		expect(architectureTopic).toBeDefined();

		const architectureReply = mainReplies.find((r): boolean => r.id === "architecture");
		expect(architectureReply).toBeDefined();
		expect(architectureReply?.label).toBe("My Overengineered Architecture");
		expect(architectureReply?.action.type).toBe("navigate");
		if (architectureReply?.action.type === "navigate") {
			expect(architectureReply.action.topicId).toBe("architecture");
		}

		const subtopicReplies = createSubtopicReplies("architecture");
		expect(subtopicReplies.length).toBeGreaterThan(0);

		const hasBackButton = subtopicReplies.some((r): boolean => r.action.type === "reset");
		expect(hasBackButton).toBe(true);

		const networkDemoReplies = createSubtopicReplies("network-demo");
		const hasNetworkOptions = networkDemoReplies.some(
			(r): boolean => r.action.type === "network-demo",
		);
		expect(hasNetworkOptions).toBe(true);

		const networkTestReplies = createNetworkTestReplies();
		const testButton = networkTestReplies.find((r): boolean => r.id === "test-network");
		expect(testButton).toBeDefined();
		expect(testButton?.label).toBe(UI_CONSTANTS.TEST_NETWORK_TEXT);
		expect(testButton?.variant).toBe("primary");
		expect(testButton?.action.type).toBe("test-network");

		const canNavigateBack = networkTestReplies.some(
			(r): boolean =>
				r.action.type === "navigate" &&
				"topicId" in r.action &&
				r.action.topicId === "network-demo",
		);
		expect(canNavigateBack).toBe(true);

		const canReturnToMain = networkTestReplies.some((r): boolean => r.action.type === "reset");
		expect(canReturnToMain).toBe(true);
	});
});
