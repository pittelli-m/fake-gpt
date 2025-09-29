import React, { useMemo } from "react";
import { View, Text, Platform } from "react-native";
import type { Message, QuickReply } from "../../../core/types";
import { InlineQuickReplies } from "./InlineQuickReplies";
import { platformUtils } from "../../../shared/utils/platform";

interface MessageItemProps {
	message: Message;
	onQuickReplySelect?: (reply: QuickReply) => void;
}

export const MessageItem = ({
	message,
	onQuickReplySelect,
}: MessageItemProps): React.JSX.Element => {
	const isUser = message.type === "user";
	const isStreaming = message.isStreaming;

	const getBubbleStyles = useMemo((): string => {
		const baseStyles = "max-w-[80%] rounded-lg px-4 py-3";

		if (isUser) {
			return Platform.select({
				ios: `${baseStyles} bg-blue-500 rounded-br-sm shadow-sm`,
				android: `${baseStyles} bg-blue-600 rounded-br-sm`,
				web: `${baseStyles} bg-blue-500 rounded-br-sm shadow-md`,
				default: `${baseStyles} bg-blue-500 rounded-br-sm`,
			});
		}

		return Platform.select({
			ios: `${baseStyles} bg-gray-100 rounded-bl-sm shadow-sm`,
			android: `${baseStyles} bg-gray-200 rounded-bl-sm`,
			web: `${baseStyles} bg-gray-100 rounded-bl-sm shadow-md`,
			default: `${baseStyles} bg-gray-100 rounded-bl-sm`,
		});
	}, [isUser]);

	const getBubbleElevation = useMemo((): object => {
		if (platformUtils.isAndroid) {
			return isUser ? platformUtils.getElevation(2) : platformUtils.getElevation(1);
		}
		return {};
	}, [isUser]);

	const accessibilityLabel = useMemo((): string => {
		const sender = isUser ? "You" : "Bot";
		const timestamp = message.timestamp.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
		const status = isStreaming ? "currently typing" : "";

		return `${sender} message at ${timestamp}${status ? `, ${status}` : ""}: ${message.content}`;
	}, [isUser, isStreaming, message.content, message.timestamp]);

	return (
		<View className="mb-4">
			<View
				className={`flex-row ${isUser ? "justify-end" : "justify-start"}`}
				accessible={true}
				accessibilityRole="text"
				accessibilityLabel={accessibilityLabel}
			>
				<View className={getBubbleStyles} style={getBubbleElevation}>
					<View className="flex-row items-end">
						<Text
							className={`text-base leading-6 ${isUser ? "text-white" : "text-gray-900"}`}
							accessible={false}
						>
							{message.content}
						</Text>
					</View>
					<Text
						className={`text-xs mt-1 ${isUser ? "text-blue-100" : "text-gray-500"}`}
						accessible={false}
					>
						{message.timestamp.toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</Text>
				</View>
			</View>

			{!isUser && message.quickReplies && message.showQuickReplies && onQuickReplySelect && (
				<InlineQuickReplies
					replies={message.quickReplies}
					onReplySelect={onQuickReplySelect}
					isActive={true}
				/>
			)}
		</View>
	);
};
