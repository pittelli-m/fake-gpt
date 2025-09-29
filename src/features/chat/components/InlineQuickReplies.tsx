import React from "react";
import { View, ScrollView } from "react-native";
import { QuickReplyButton } from "./QuickReplyButton";
import type { QuickReply } from "../../../core/types";

interface InlineQuickRepliesProps {
	replies: QuickReply[];
	onReplySelect: (reply: QuickReply) => void;
	isActive: boolean;
}

export const InlineQuickReplies = ({
	replies,
	onReplySelect,
	isActive,
}: InlineQuickRepliesProps): React.JSX.Element | null => {
	if (!isActive || replies.length === 0) {
		return null;
	}

	const handleSelect = (reply: QuickReply): void => {
		onReplySelect(reply);
	};

	return (
		<View className="px-4 py-2">
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingRight: 16 }}
				className="flex-row"
			>
				{replies.map(
					(reply): React.JSX.Element => (
						<View key={reply.id} className="mr-2">
							<QuickReplyButton
								reply={reply}
								onPress={(): void => handleSelect(reply)}
								disabled={false}
							/>
						</View>
					),
				)}
			</ScrollView>
		</View>
	);
};
