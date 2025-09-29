import React, { useCallback, useRef } from "react";
import { TouchableOpacity, Text, Animated } from "react-native";
import type { QuickReply } from "../../../core/types";

interface QuickReplyButtonProps {
	reply: QuickReply;
	onPress: (reply: QuickReply) => void;
	disabled?: boolean;
	isLoading?: boolean;
}

export const QuickReplyButton = ({
	reply,
	onPress,
	disabled = false,
	isLoading = false,
}: QuickReplyButtonProps): React.JSX.Element => {
	const scaleAnim = useRef(new Animated.Value(1)).current;

	const getVariantStyles = (variant: QuickReply["variant"]): string => {
		switch (variant) {
			case "primary":
				return "bg-blue-500 border-blue-500";
			case "secondary":
				return "bg-gray-200 border-gray-300";
			case "info":
				return "bg-purple-500 border-purple-500";
			default:
				return "bg-white border-gray-300";
		}
	};

	const handlePress = useCallback((): void => {
		if (disabled || isLoading) return;
		onPress(reply);
	}, [reply, onPress, disabled, isLoading]);

	const handlePressIn = useCallback((): void => {
		Animated.spring(scaleAnim, {
			toValue: 0.95,
			useNativeDriver: true,
			speed: 50,
		}).start();
	}, [scaleAnim]);

	const handlePressOut = useCallback((): void => {
		Animated.spring(scaleAnim, {
			toValue: 1,
			useNativeDriver: true,
			speed: 50,
		}).start();
	}, [scaleAnim]);

	const variantStyles = getVariantStyles(reply.variant);
	const isDisabled = disabled || isLoading;

	return (
		<Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
			<TouchableOpacity
				onPress={handlePress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				disabled={isDisabled}
				className={`
            rounded-full px-4 py-2 flex-row items-center border
            ${variantStyles}
            ${isDisabled ? "opacity-50" : "opacity-100"}
          `}
				accessible={true}
				accessibilityRole="button"
				accessibilityLabel={reply.label}
				accessibilityHint={`Tap to ${reply.userMessage.toLowerCase()}`}
				accessibilityState={{ disabled: isDisabled }}
			>
				<Text
					className={`
            text-sm font-medium
            ${
							reply.variant === "secondary" || !reply.variant
								? "text-gray-800"
								: reply.variant === "primary"
									? "text-white"
									: "text-white"
						}
          `}
					numberOfLines={1}
					ellipsizeMode="tail"
				>
					{reply.label}
				</Text>
			</TouchableOpacity>
		</Animated.View>
	);
};
