import { useState, useCallback } from "react";
import { streamingEngine } from "../../../core/services/streamingEngine";
import type { Message, ConversationState, Topic, QuickReply } from "../../../core/types";
import { createUserMessage, createBotMessage } from "../../../core/content";
import { useBotResponse } from "./useBotResponse";

const initialState: ConversationState = {
	messages: [],
	selectedTopic: null,
	isLoading: false,
	streamingMessageId: null,
};

export const useConversation = (): {
	state: ConversationState;
	addUserMessage: (content: string) => void;
	addBotMessage: (content: string, quickReplies?: QuickReply[]) => void;
	addBotMessageWithDemo: (content: string, demoComponent: "network-demo") => void;
	selectTopic: (topic: Topic) => void;
	clearConversation: () => void;
	deleteMessage: (messageId: string) => void;
	isResponseLoading: boolean;
} => {
	const [state, setState] = useState<ConversationState>(initialState);
	const botResponseMutation = useBotResponse();

	const addBotMessage = useCallback((content: string, quickReplies?: QuickReply[]): void => {
		const messageId = `bot-${Date.now()}`;
		const botMessage = createBotMessage("", true);
		botMessage.id = messageId;

		if (quickReplies) {
			botMessage.quickReplies = quickReplies;
			botMessage.showQuickReplies = true;
		}

		setState(
			(prev): ConversationState => ({
				...prev,
				messages: [...prev.messages, botMessage],
				streamingMessageId: messageId,
				isLoading: true,
			}),
		);

		streamingEngine.startStreaming({
			content,
			onChunk: (chunk: string): void => {
				setState(
					(prev): ConversationState => ({
						...prev,
						messages: prev.messages.map(
							(msg): Message =>
								msg.id === messageId ? { ...msg, content: msg.content + chunk } : msg,
						),
					}),
				);
			},
			onComplete: (): void => {
				setState(
					(prev): ConversationState => ({
						...prev,
						messages: prev.messages.map(
							(msg): Message => (msg.id === messageId ? { ...msg, isStreaming: false } : msg),
						),
						streamingMessageId: null,
						isLoading: false,
					}),
				);
			},
			speed: content.length > 100 ? "fast" : "normal",
			interruptible: true,
		});
	}, []);

	const addBotMessageWithDemo = useCallback(
		(content: string, demoComponent: "network-demo"): void => {
			const messageId = `bot-${Date.now()}`;
			const botMessage = createBotMessage("", true);
			botMessage.id = messageId;
			botMessage.demoComponent = demoComponent;

			setState(
				(prev): ConversationState => ({
					...prev,
					messages: [...prev.messages, botMessage],
					streamingMessageId: messageId,
					isLoading: true,
				}),
			);

			streamingEngine.startStreaming({
				content,
				onChunk: (chunk: string): void => {
					setState(
						(prev): ConversationState => ({
							...prev,
							messages: prev.messages.map(
								(msg): Message =>
									msg.id === messageId ? { ...msg, content: msg.content + chunk } : msg,
							),
						}),
					);
				},
				onComplete: (): void => {
					setState(
						(prev): ConversationState => ({
							...prev,
							messages: prev.messages.map(
								(msg): Message => (msg.id === messageId ? { ...msg, isStreaming: false } : msg),
							),
							streamingMessageId: null,
							isLoading: false,
						}),
					);
				},
				speed: content.length > 100 ? "fast" : "normal",
				interruptible: true,
			});
		},
		[],
	);

	const addUserMessage = useCallback(
		(content: string): void => {
			const userMessage = createUserMessage(content);

			setState((prev): ConversationState => {
				const updatedMessages = prev.messages.map(
					(msg): Message => ({
						...msg,
						showQuickReplies: false,
					}),
				);
				const newState = {
					...prev,
					messages: [...updatedMessages, userMessage],
				};

				if (prev.selectedTopic) {
					botResponseMutation.mutate({
						topicId: prev.selectedTopic.id,
						onStreamingStart: (messageId: string): void => {
							const botMessage = createBotMessage("", true, prev.selectedTopic?.id);
							botMessage.id = messageId;

							setState(
								(streamPrev): ConversationState => ({
									...streamPrev,
									messages: [...streamPrev.messages, botMessage],
									streamingMessageId: messageId,
									isLoading: true,
								}),
							);
						},
						onStreamingChunk: (chunk: string): void => {
							setState(
								(streamPrev): ConversationState => ({
									...streamPrev,
									messages: streamPrev.messages.map(
										(msg): Message =>
											msg.id === streamPrev.streamingMessageId
												? { ...msg, content: msg.content + chunk }
												: msg,
									),
								}),
							);
						},
						onStreamingComplete: (): void => {
							setState(
								(streamPrev): ConversationState => ({
									...streamPrev,
									messages: streamPrev.messages.map(
										(msg): Message =>
											msg.id === streamPrev.streamingMessageId
												? { ...msg, isStreaming: false }
												: msg,
									),
									streamingMessageId: null,
									isLoading: false,
								}),
							);
						},
					});
				}

				return newState;
			});
		},
		[botResponseMutation],
	);

	const selectTopic = useCallback((topic: Topic): void => {
		setState(
			(prev): ConversationState => ({
				...prev,
				selectedTopic: topic,
			}),
		);
	}, []);

	const clearConversation = useCallback((): void => {
		setState(initialState);
	}, []);

	const deleteMessage = useCallback((messageId: string): void => {
		setState(
			(prev): ConversationState => ({
				...prev,
				messages: prev.messages.filter((msg): boolean => msg.id !== messageId),
			}),
		);
	}, []);

	return {
		state,
		addUserMessage,
		addBotMessage,
		addBotMessageWithDemo,
		selectTopic,
		clearConversation,
		deleteMessage,
		isResponseLoading: botResponseMutation.isPending,
	};
};
