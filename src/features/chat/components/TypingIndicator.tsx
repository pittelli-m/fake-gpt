import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";

interface TypingIndicatorProps {
	isVisible: boolean;
}

export const TypingIndicator = ({ isVisible }: TypingIndicatorProps): React.JSX.Element | null => {
	const opacity = useRef(new Animated.Value(0)).current;
	const dotAnimations = useRef([
		new Animated.Value(0),
		new Animated.Value(0),
		new Animated.Value(0),
	]).current;

	useEffect((): (() => void) | void => {
		if (isVisible) {
			Animated.timing(opacity, {
				toValue: 1,
				duration: 200,
				useNativeDriver: true,
			}).start();

			const animateDots = (): void => {
				const animations = dotAnimations.map(
					(anim, index): Animated.CompositeAnimation =>
						Animated.sequence([
							Animated.delay(index * 200),
							Animated.timing(anim, {
								toValue: 1,
								duration: 600,
								useNativeDriver: true,
							}),
							Animated.timing(anim, {
								toValue: 0,
								duration: 600,
								useNativeDriver: true,
							}),
						]),
				);

				Animated.loop(Animated.stagger(100, animations), { iterations: -1 }).start();
			};

			animateDots();
		} else {
			Animated.timing(opacity, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start();

			dotAnimations.forEach((anim): void => {
				anim.setValue(0);
			});
		}

		return (): void => {
			dotAnimations.forEach((anim): void => {
				anim.stopAnimation();
			});
		};
	}, [isVisible, opacity, dotAnimations]);

	if (!isVisible) {
		return null;
	}

	return (
		<Animated.View style={{ opacity }} className="mb-4 flex-row justify-start">
			<View className="bg-gray-200 rounded-lg rounded-bl-sm px-4 py-3 max-w-[80%]">
				<View className="flex-row items-center">
					<Text className="text-gray-600 text-base mr-2">Bot is typing</Text>
					<View className="flex-row space-x-1">
						{dotAnimations.map(
							(anim, index): React.JSX.Element => (
								<Animated.View
									key={index}
									style={{
										opacity: anim,
										transform: [
											{
												scale: anim.interpolate({
													inputRange: [0, 1],
													outputRange: [0.5, 1],
												}),
											},
										],
									}}
									className="w-2 h-2 bg-gray-500 rounded-full"
								/>
							),
						)}
					</View>
				</View>
			</View>
		</Animated.View>
	);
};
