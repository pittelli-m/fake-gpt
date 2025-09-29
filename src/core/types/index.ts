export interface Message {
	id: string;
	type: "user" | "bot";
	content: string;
	timestamp: Date;
	isStreaming?: boolean;
	quickReplies?: QuickReply[];
	showQuickReplies?: boolean;
	demoComponent?: "network-demo";
}

export interface QuickReply {
	id: string;
	label: string;
	userMessage: string;
	action: QuickReplyAction;
	variant?: "primary" | "secondary" | "info";
}

export type QuickReplyAction =
	| { type: "navigate"; topicId: string; subtopicId?: string }
	| { type: "network-demo"; mode: NetworkMode }
	| { type: "test-network" }
	| { type: "reset" };

export type NetworkMode = "normal" | "slow" | "fail";
export type DemoType = "network-normal" | "network-slow" | "network-fail";

export interface NetworkSimulation {
	isSlowConnection: boolean;
	delay: number;
	willFail: boolean;
	retryCount: number;
}

export interface ApiResponse<T> {
	data: T;
	success: boolean;
	networkSim: NetworkSimulation;
	timestamp: Date;
}

export interface ConversationState {
	messages: Message[];
	selectedTopic: Topic | null;
	isLoading: boolean;
	streamingMessageId: string | null;
}

export interface Topic {
	id: string;
	title: string;
	description: string;
	category: string;
	estimatedReadTime: number;
}

export interface Subtopic {
	id: string;
	parentId: string;
	title: string;
	content: string;
}

export type ConnectionQuality = "fast" | "slow" | "poor";
