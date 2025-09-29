import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Platform, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MessageList } from "../components/MessageList";
import { TypingIndicator } from "../components/TypingIndicator";
import { useConversation } from "../hooks/useConversation";
import { demoModeService } from "../../../core/services/demoModeService";
import { CHAT_CONTENT, getTopicContent, getSubtopicContent } from "../../../core/constants/topics";
import { UI_CONSTANTS } from "../../../core/constants/ui";
import { TIMING } from "../../../core/constants/timing";
import {
	createMainTopicReplies,
	createSubtopicReplies,
	createSubtopicNavigationReplies,
	createNetworkTestReplies,
} from "../../../shared/utils/quickReplyFactory";
import {
	getNetworkModeMessage,
	getNetworkTestStartMessage,
	getNetworkTestResultMessage,
} from "../../../shared/utils/messageHelpers";
import type { QuickReply, DemoType, NetworkMode } from "../../../core/types";

const ChatScreen = (): React.JSX.Element => {
	const { state, addUserMessage, addBotMessage, clearConversation } = useConversation();
	const [hasGreeted, setHasGreeted] = useState(false);

	useEffect((): void => {
		if (!hasGreeted && state.messages.length === 0) {
			setTimeout((): void => {
				addBotMessage(CHAT_CONTENT.greeting, createMainTopicReplies());
				setHasGreeted(true);
			}, TIMING.GREETING_DELAY);
		}
	}, [hasGreeted, state.messages.length, addBotMessage]);

	const handleQuickReplySelect = useCallback(
		(reply: QuickReply): void => {
			addUserMessage(reply.userMessage);

			switch (reply.action.type) {
				case "navigate":
					handleNavigation(reply.action.topicId as string, reply.action.subtopicId);
					break;
				case "network-demo":
					handleNetworkDemo(reply.action.mode);
					break;
				case "test-network":
					handleNetworkTest();
					break;
				case "reset":
					handleReset();
					break;
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[addUserMessage],
	);

	const handleNavigation = (topicId: string, subtopicId?: string): void => {
		if (subtopicId) {
			const content = getSubtopicContent(topicId, subtopicId);
			if (content) {
				const topic = getTopicContent(topicId);
				setTimeout((): void => {
					addBotMessage(
						content.content,
						createSubtopicNavigationReplies(topicId, topic?.label || topicId),
					);
				}, TIMING.RESPONSE_DELAY);
			}
		} else {
			const topic = getTopicContent(topicId);
			if (topic) {
				setTimeout((): void => {
					addBotMessage(topic.mainContent, createSubtopicReplies(topicId));
				}, TIMING.RESPONSE_DELAY);
			}
		}
	};

	const handleNetworkDemo = (mode: NetworkMode): void => {
		const demoType: DemoType = `network-${mode}` as DemoType;
		demoModeService.enableDemoMode(demoType);

		setTimeout((): void => {
			addBotMessage(getNetworkModeMessage(mode), createNetworkTestReplies());
		}, TIMING.RESPONSE_DELAY);
	};

	const handleNetworkTest = (): void => {
		const currentMode = demoModeService.getNetworkMode() as NetworkMode;
		const delay =
			currentMode === "slow"
				? TIMING.NETWORK_SLOW_DELAY
				: currentMode === "fail"
					? TIMING.NETWORK_FAIL_DELAY
					: TIMING.NETWORK_NORMAL_DELAY;

		setTimeout((): void => {
			addBotMessage(getNetworkTestStartMessage(currentMode));
		}, TIMING.RESPONSE_DELAY);

		setTimeout((): void => {
			addBotMessage(getNetworkTestResultMessage(currentMode), createNetworkTestReplies());
		}, delay + TIMING.RESPONSE_DELAY);
	};

	const handleReset = (): void => {
		demoModeService.disableDemoMode();
		setTimeout((): void => {
			addBotMessage(UI_CONSTANTS.MAIN_TOPICS_TEXT, createMainTopicReplies());
		}, TIMING.RESPONSE_DELAY);
	};

	const handleClearConversation = (): void => {
		clearConversation();
		demoModeService.disableDemoMode();
		setHasGreeted(false);
	};

	return (
		<SafeAreaView className="flex-1 bg-gray-50">
			<KeyboardAvoidingView
				className="flex-1"
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
			>
				<View className="flex-1">
					<MessageList messages={state.messages} onQuickReplySelect={handleQuickReplySelect} />

					{state.streamingMessageId && (
						<View className="px-4">
							<TypingIndicator isVisible={true} />
						</View>
					)}

					{state.messages.length > 1 && (
						<View className="px-4 py-2 bg-white border-t border-gray-100">
							<TouchableOpacity
								onPress={handleClearConversation}
								className="py-2 px-4 bg-gray-100 rounded-lg"
								accessibilityRole="button"
								accessibilityLabel={UI_CONSTANTS.CLEAR_BUTTON_TEXT}
							>
								<Text className="text-center text-gray-700 font-medium">
									{UI_CONSTANTS.CLEAR_BUTTON_TEXT}
								</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default ChatScreen;
