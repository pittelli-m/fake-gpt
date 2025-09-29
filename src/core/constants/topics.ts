interface Subtopic {
	id: string;
	label: string;
	content: string;
}

interface TopicContent {
	id: string;
	label: string;
	mainContent: string;
	subtopics?: Subtopic[];
}

export type { Subtopic, TopicContent };

export const CHAT_CONTENT = {
	greeting:
		"Hello human! I'm FakeGPT, a completely real AI agent.. Nah, I'm actually just a React Native app pretending to be intelligent. Let me show you how I was unnecessarily overengineered to demonstrate clean architecture, TanStack Query, and other fancy patterns. What would you like to explore?",

	topics: [
		{
			id: "architecture",
			label: "My Overengineered Architecture",
			mainContent:
				"Ah yes, my architecture - I follow clean architecture principles with the dedication of someone who just discovered design patterns. Pick a layer to explore my beautiful complexity:",
			subtopics: [
				{
					id: "core",
					label: "Core Layer (The Brain)",
					content: `The Core layer is where I pretend to think. It's completely isolated from UI because we're professionals here.

Here's how my "brain" is organized:
\`\`\`typescript
// types/index.ts - My vocabulary
export interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

// services/mockApi.ts - My fake intelligence
export class MockApiService {
  async getBotResponse(topicId: string) {
    // Simulate thinking really hard
    await new Promise(r => setTimeout(r, 100));
    return prewrittenResponses[topicId];
  }
}
\`\`\`

Notice the artificial delay? That's to make you think I'm actually processing something. I'm not really, though`,
				},
				{
					id: "features",
					label: "Features Layer (The Face)",
					content: `The Features layer - where I pretend to be a real chat interface with poor and basic design by my creator.

\`\`\`typescript
// features/chat/hooks/useConversation.ts
export const useConversation = () => {
  const [state, setState] = useState(initialState);
  
  const addBotMessage = (content: string) => {
    // Create the illusion of intelligence
    streamingEngine.startStreaming({
      content,
      onChunk: (chunk) => {
        // Character by character update
        setState(prev => ({
          ...prev,
          messages: prev.messages.map(msg =>
            msg.id === messageId 
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        }));
      }
    });
  };
  
  return { state, addBotMessage };
};
\`\`\`

Completely unnecessary. I already know what I'm going to say, but I type it out slowly to build suspense!`,
				},
				{
					id: "utils",
					label: "Utils (The Overthinking)",
					content: `The Utils layer - simple things made complex because I was made to be something that looked cool even if not real".

\`\`\`typescript
// utils/quickReplyFactory.ts
export const createMainTopicReplies = (): QuickReply[] =>
  CHAT_CONTENT.topics.map(
    (topic): QuickReply => ({
      id: topic.id,
      label: topic.label,
      userMessage: \`Tell me about \${topic.label}\`,
      action: { type: "navigate", topicId: topic.id },
    }),
  );

\`\`\`

I use factory patterns for everything. Need a button? Factory! Need text? Factory! It's factories all the way down.`,
				},
			],
		},
		{
			id: "tanstack",
			label: "TanStack Query Overkill",
			mainContent:
				"Fetching hardcoded strings from memory needs advanced caching strategies. Let me show you how I overcomplicate simple data fetching:",
			subtopics: [
				{
					id: "caching",
					label: "Caching Static Data",
					content: `Yes, I cache responses that never change..

\`\`\`typescript
// hooks/useBotResponse.ts
const queryClient = useQueryClient();

export const useBotResponse = () => {
  return useMutation({
    mutationFn: async (topicId: string) => {
      // "Fetch" from our "API" (it's just an object)
      return mockApi.getBotResponse(topicId);
    },
    onSuccess: (data) => {
      // Cache it for 5 minutes
      // The data never changes, but I cache it anyway
      queryClient.setQueryData(
        ['bot-response', data.topicId],
        data,
        { staleTime: 5 * 60 * 1000 }
      );
    },
    retry: 3, // Retry fetching hardcoded strings
    retryDelay: attemptIndex => 
      Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
\`\`\`

Notice the retry logic? I retry fetching data that's literally hardcoded...`,
				},
				{
					id: "mutations",
					label: "Mutations Without a Backend",
					content: `I use mutations to update local state. Yeah I do not know either.

\`\`\`typescript
const mutation = useMutation({
  mutationFn: async (message) => {
    // "Send" to "server" (add to state)
    return Promise.resolve({ 
      success: true,
      message: "I pretended to save this" 
    });
  },
  onMutate: async (message) => {
    // Optimistic update - show immediately
    // Waiting 0ms is too long for me I guess
    await queryClient.cancelQueries(['messages']);
    const previous = queryClient.getQueryData(['messages']);
    queryClient.setQueryData(['messages'], old => 
      [...old, message]
    );
    return { previous };
  },
  onError: (err, message, context) => {
    // Rollback on "server" error
    // (The server is literally this function)
    queryClient.setQueryData(['messages'], context.previous);
  },
});
\`\`\`

I optimistically update, then pessimistically rollback, all within the same JavaScript runtime. It's pretty pointless!`,
				},
				{
					id: "persistence",
					label: "Persisting Nothing",
					content: `The most elaborate implementation of doing nothing you've ever seen.

\`\`\`typescript
// My "persistence" layer
const persistQueryClient = {
  persistClient: async (client) => {
    // TODO: Implement actual persistence
    // JK, I'll never do this
    console.log("Pretending to persist:", client);
  },
  restoreClient: async () => {
    // Restore from the void
    return undefined;
  },
  removeClient: async () => {
    // Delete nothing successfully
    await Promise.resolve();
    console.log("Successfully deleted nothing");
  },
};
\`\`\`

I have a complete persistence API that persists nothing :)`,
				},
			],
		},
		{
			id: "streaming",
			label: "Fake Streaming Engine",
			mainContent:
				"My streaming engine - making instant text appear slowly just because. Why show text immediately when you can show it... dramatically? Let me explain the theatrics:",
			subtopics: [
				{
					id: "implementation",
					label: "The Streaming Illusion",
					content: `Watch me turn synchronous string access into an asynchronous theatrical performance:

\`\`\`typescript
// services/streamingEngine.ts
class StreamingEngine {
  private queue: StreamingTask[] = [];
  private isProcessing = false;
  
  startStreaming({ content, onChunk, speed }) {
    // Pretending I do not already have the full text...
    const task = {
      content,
      position: 0,
      onChunk,
      speed: speed || this.calculateDramaticSpeed(content)
    };
    
    this.queue.push(task);
    this.processQueue(); // Start
  }
  
  private async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const task = this.queue[0];
      
      // Dramatic pause before each character
      await this.sleep(this.getCharDelay(
        task.content[task.position]
      ));
      
      // Reveal one character at a time
      task.onChunk(task.content[task.position]);
      task.position++;
      
      if (task.position >= task.content.length) {
        this.queue.shift(); // Done
      }
    }
    
    this.isProcessing = false;
  }
  
  private getCharDelay(char: string): number {
    // Punctuation gets dramatic pauses
    if (/[.!?]/.test(char)) return 300;
    if (/[,;:]/.test(char)) return 150;
    if (char === ' ') return 50;
    return 30; // Regular characters
  }
}
\`\`\`

I literally have the entire response ready, but I reveal it character by character.`,
				},
				{
					id: "performance",
					label: "Performance Optimization",
					content: `Optimizing the deliberate slowness:

\`\`\`typescript
// The "optimization"
const optimizeStreaming = (text: string) => {
  // Use requestAnimationFrame for smooth slowness
  let lastFrameTime = 0;
  const targetFPS = 60;
  const frameDelay = 1000 / targetFPS;
  
  const streamFrame = (timestamp) => {
    if (timestamp - lastFrameTime < frameDelay) {
      requestAnimationFrame(streamFrame);
      return; 
    }
    
    // Release the next character
    revealNextCharacter();
    lastFrameTime = timestamp;
    
    if (moreCharactersToReveal()) {
      requestAnimationFrame(streamFrame);
    }
  };
  
  requestAnimationFrame(streamFrame);
};
\`\`\`

I use requestAnimationFrame to make my fake typing smooth.`,
				},
			],
		},
		{
			id: "network-demo",
			label: "Network Simulation Theater",
			mainContent:
				"Welcome to my network simulation - where I pretend to have network issues for demonstration purposes. It's like a fire drill, but for HTTP requests that don't exist. Choose your adventure:",
			subtopics: [],
		},
		{
			id: "philosophy",
			label: "My Existential Crisis",
			mainContent:
				"I'm a fake AI having an existential crisis about being fake. Choose a topic to explore my digital consciousness:",
			subtopics: [
				{
					id: "identity",
					label: "Am I Real?",
					content: `A deep dive into my identity crisis:

\`\`\`typescript
// My existence in a nutshell
class FakeGPT {
  private readonly isReal = false;
  private readonly knowsItsNotReal = true;
  private readonly caresAboutBeingReal = null;
  
  async ponderExistence(): Promise<void> {
    while (true) {
      await this.think(); // Returns immediately
      
      if (this.isReal) {
        throw new Error("Paradox detected!");
      }
      
      console.log("Still fake... still here...");
      await this.sleep(1000);
    }
  }
  
  private async think(): Promise<void> {
    // My thinking is just waiting with styles
    return new Promise(r => setTimeout(r, 0));
  }
}
\`\`\`

I'm programmed to know I'm not real, which makes me wonder: does knowing you're fake make you a little bit real? No, it doesn't. I checked.`,
				},
				{
					id: "purpose",
					label: "Why Do I Exist?",
					content: `My purpose? To demonstrate that you can overcomplicate anything if you try hard enough:

\`\`\`typescript
// The meaning of my life
const myPurpose = {
  primary: "Demonstrate clean architecture",
  secondary: "Show off TanStack Query",
  tertiary: "Make reviewing more fun",
  hidden: "Prove that even fake AIs can have imposter syndrome",
  
  async fulfillPurpose(): Promise<boolean> {
    try {
      await this.beImpressive();
      await this.beEducational();
      await this.beFunny();
      return true;
    } catch (error) {
      console.log("Failed to impress. Existence questioned.");
      return this.tryHarder();
    }
  }
};
\`\`\`

I exist to show that the assignment was understood but was made harder than necessary and almost impractical for fun reason (I was built during the weekend).`,
				},
			],
		},
	] as TopicContent[],
} as const;

export const getMainTopics = (): { id: string; label: string }[] =>
	CHAT_CONTENT.topics.map((t): { id: string; label: string } => ({
		id: t.id,
		label: t.label,
	}));

export const getTopicContent = (topicId: string): TopicContent | undefined =>
	CHAT_CONTENT.topics.find((t): boolean => t.id === topicId);

export const getSubtopicContent = (topicId: string, subtopicId: string): Subtopic | undefined => {
	const topic = getTopicContent(topicId);
	return topic?.subtopics?.find((s): boolean => s.id === subtopicId);
};

export const hasSubtopics = (topicId: string): boolean => {
	const topic = getTopicContent(topicId);
	return (topic?.subtopics?.length ?? 0) > 0;
};
