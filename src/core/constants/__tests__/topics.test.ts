import { CHAT_CONTENT, getTopicContent, getSubtopicContent } from "../topics";

describe("Chat Navigation Flow - Topic Content", (): void => {
	it("should provide complete navigation flow through chat topics", (): void => {
		expect(CHAT_CONTENT.greeting).toBeDefined();
		expect(CHAT_CONTENT.greeting).toContain("FakeGPT");

		expect(CHAT_CONTENT.topics).toBeDefined();
		expect(CHAT_CONTENT.topics.length).toBeGreaterThan(0);

		const architectureTopic = CHAT_CONTENT.topics.find((t): boolean => t.id === "architecture");
		expect(architectureTopic).toBeDefined();
		expect(architectureTopic?.label).toBe("My Overengineered Architecture");
		expect(architectureTopic?.mainContent).toContain("clean architecture principles");

		const topicContent = getTopicContent("architecture");
		expect(topicContent).toBeDefined();
		expect(topicContent?.id).toBe("architecture");
		expect(topicContent?.subtopics).toBeDefined();
		expect(topicContent?.subtopics?.length).toBeGreaterThan(0);

		const firstSubtopic = topicContent?.subtopics?.[0];
		expect(firstSubtopic).toBeDefined();
		expect(firstSubtopic?.id).toBe("core");
		expect(firstSubtopic?.label).toBe("Core Layer (The Brain)");

		const subtopicContent = getSubtopicContent("architecture", "core");
		expect(subtopicContent).toBeDefined();
		expect(subtopicContent?.content).toContain("Message");

		const networkDemo = getTopicContent("network-demo");
		expect(networkDemo).toBeDefined();
		expect(networkDemo?.label).toBe("Network Simulation Theater");
		expect(networkDemo?.mainContent).toContain("network simulation");

		const invalidTopic = getTopicContent("non-existent");
		expect(invalidTopic).toBeUndefined();

		const invalidSubtopic = getSubtopicContent("architecture", "non-existent");
		expect(invalidSubtopic).toBeUndefined();

		CHAT_CONTENT.topics.forEach((topic): void => {
			expect(topic.id).toBeDefined();
			expect(topic.label).toBeDefined();
			expect(topic.mainContent).toBeDefined();
		});
	});
});
