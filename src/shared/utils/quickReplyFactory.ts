import { CHAT_CONTENT, getTopicContent } from "../../core/constants/topics";
import { UI_CONSTANTS } from "../../core/constants/ui";
import type { QuickReply } from "../../core/types";

export const createMainTopicReplies = (): QuickReply[] =>
	CHAT_CONTENT.topics.map(
		(topic): QuickReply => ({
			id: topic.id,
			label: topic.label,
			userMessage: `Tell me about ${topic.label.toLowerCase()}`,
			action: { type: "navigate", topicId: topic.id },
		}),
	);

export const createBackButton = (target: "main" | string, label?: string): QuickReply => ({
	id: `back-${target}`,
	label:
		label || (target === "main" ? UI_CONSTANTS.BACK_TO_MAIN_TEXT : UI_CONSTANTS.BACK_BUTTON_TEXT),
	userMessage: target === "main" ? "Back to main topics" : `Back to ${target}`,
	action: target === "main" ? { type: "reset" } : { type: "navigate", topicId: target },
});

export const createSubtopicReplies = (topicId: string): QuickReply[] => {
	const topic = getTopicContent(topicId);
	if (!topic) return [createBackButton("main")];

	const replies: QuickReply[] = [];

	if (topic.subtopics && topic.subtopics.length > 0) {
		topic.subtopics.forEach((subtopic): void => {
			replies.push({
				id: subtopic.id,
				label: subtopic.label,
				userMessage: `Tell me about ${subtopic.label.toLowerCase()}`,
				action: {
					type: "navigate",
					topicId: topicId,
					subtopicId: subtopic.id,
				},
			});
		});
	}

	if (topicId === "network-demo") {
		replies.push(
			{
				id: "demo-normal",
				label: `${UI_CONSTANTS.NETWORK_NORMAL_TEXT} Network`,
				userMessage: "Set network to normal",
				action: { type: "network-demo", mode: "normal" },
			},
			{
				id: "demo-slow",
				label: `${UI_CONSTANTS.NETWORK_SLOW_TEXT} Network`,
				userMessage: "Set network to slow",
				action: { type: "network-demo", mode: "slow" },
			},
			{
				id: "demo-fail",
				label: `${UI_CONSTANTS.NETWORK_FAIL_TEXT} Network`,
				userMessage: "Set network to fail",
				action: { type: "network-demo", mode: "fail" },
			},
		);
	}

	replies.push(createBackButton("main"));

	return replies;
};

export const createSubtopicNavigationReplies = (
	topicId: string,
	topicLabel: string,
): QuickReply[] => [
	{
		id: "back-topic",
		label: `Back to ${topicLabel}`,
		userMessage: `Back to ${topicLabel.toLowerCase()}`,
		action: { type: "navigate", topicId },
	},
	createBackButton("main"),
];

export const createNetworkTestReplies = (): QuickReply[] => [
	{
		id: "test-network",
		label: UI_CONSTANTS.TEST_NETWORK_TEXT,
		userMessage: "Test the current network mode",
		action: { type: "test-network" },
		variant: "primary",
	},
	{
		id: "back-network",
		label: "Back to Network Demo",
		userMessage: "Back to network options",
		action: { type: "navigate", topicId: "network-demo" },
	},
	createBackButton("main"),
];
