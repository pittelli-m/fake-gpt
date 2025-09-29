import React, { useCallback, useRef, useEffect, useState } from "react";
import { FlashList, type FlashListRef, type ListRenderItem } from "@shopify/flash-list";
import type { Message, QuickReply } from "../../../core/types";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
	messages: Message[];
	onQuickReplySelect?: (reply: QuickReply) => void;
}

const getItemType = (item: Message): string => {
	return item.type;
};

export const MessageList = ({
	messages,
	onQuickReplySelect,
}: MessageListProps): React.JSX.Element => {
	const listRef = useRef<FlashListRef<Message>>(null);
	const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const lastScrollTime = useRef<number>(0);
	const [isAutoScrollEnabled] = useState(true);

	useEffect((): (() => void) | void => {
		if (messages.length > 0 && isAutoScrollEnabled) {
			const timer = setTimeout((): void => {
				listRef.current?.scrollToEnd({ animated: true });
			}, 100);

			return (): void => clearTimeout(timer);
		}
	}, [messages.length, isAutoScrollEnabled]);

	useEffect((): (() => void) | void => {
		const streamingMessage = messages.find((msg): boolean => msg.isStreaming || false);

		if (streamingMessage && isAutoScrollEnabled) {
			const now = Date.now();
			const timeSinceLastScroll = now - lastScrollTime.current;

			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}

			const hasCodeBlocks = streamingMessage.content.includes("```");
			const scrollInterval = hasCodeBlocks ? 1000 : 500; // Scroll less frequently for code

			if (timeSinceLastScroll > scrollInterval) {
				listRef.current?.scrollToEnd({ animated: false });
				lastScrollTime.current = now;
			} else {
				scrollTimeoutRef.current = setTimeout((): void => {
					if (isAutoScrollEnabled) {
						listRef.current?.scrollToEnd({ animated: false });
						lastScrollTime.current = Date.now();
					}
				}, scrollInterval - timeSinceLastScroll);
			}

			return (): void => {
				if (scrollTimeoutRef.current) {
					clearTimeout(scrollTimeoutRef.current);
				}
			};
		} else if (!streamingMessage) {
			const timer = setTimeout((): void => {
				if (isAutoScrollEnabled) {
					listRef.current?.scrollToEnd({ animated: true });
				}
			}, 100);

			return (): void => clearTimeout(timer);
		}
	}, [messages, isAutoScrollEnabled]);

	const renderItem: ListRenderItem<Message> = useCallback(
		({ item }): React.JSX.Element => {
			return <MessageItem message={item} onQuickReplySelect={onQuickReplySelect} />;
		},
		[onQuickReplySelect],
	);

	const keyExtractor = useCallback((item: Message): string => item.id, []);

	return (
		<FlashList
			ref={listRef}
			data={messages}
			renderItem={renderItem}
			keyExtractor={keyExtractor}
			getItemType={getItemType}
			contentContainerStyle={{ padding: 16 }}
			showsVerticalScrollIndicator={false}
			removeClippedSubviews={true}
			accessible={true}
			accessibilityRole="list"
			accessibilityLabel={`Conversation with ${messages.length} message${messages.length === 1 ? "" : "s"}`}
		/>
	);
};
