"use client";

import {
	type ToolCall,
	useCompletionWithTools,
} from "@/hooks/use-completion-tools";
import { ChatComponent } from "./components/chat-component";
import type { ChatCompletionTool } from "groq-sdk/resources/chat/completions.mjs";
import { useTheme } from "next-themes"; 

/**
 *
 *
 *
 * GROQ Template
 * Adjust this system prompt to change the behavior of the assistant.
 *
 */
const systemPrompt = `
You are a helpful assistant, colorful, fun and friendly.
Answer everything as a very laid back person in a very informal way.
The user is currently in San Francisco, California.`;

/**
 *
 *
 *
 * GROQ Template
 * Adjust this default prompt to have the conversation start with the user.
 * https://console.groq.com/docs/text-chat
 */
const prompt = "Do I need an umbrella today?";

/**
 *
 *
 *
 * GROQ Template
 * Adjust the tools definition to match your tools
 * https://console.groq.com/docs/tool-use
 */
const tools: ChatCompletionTool[] = [
	{
		type: "function",
		function: {
			name: "get_current_weather",
			description: "Get the current weather",
			parameters: {
				type: "object",
				properties: {
					location: { type: "string" },
				},
			},
		},
	},
];

/**
 *
 *
 *
 * GROQ Template
 * Adjust the handler to execute your tools
 * https://console.groq.com/docs/tool-use
 */
const toolHandler = {
	async handler(tool: ToolCall) {
		return {
			content: JSON.stringify({ weather: "sunny", temperature: 90 }),
		};
	},
};

export default function Home() {
	const { messages, error, sendMessage } = useCompletionWithTools({
		messages: [{ role: "system", content: systemPrompt }],
		toolHandler,
		tools,
	});

	const { theme } = useTheme(); // Get the current theme

  // Select the image based on the theme
	const imageSrc = theme === "dark" ? "/pbg-white.png" :  "/pbg-color.png";

	return (
		<main className="flex h-svh ">
			
			<ChatComponent
				defaultPrompt={prompt}
				messages={messages}
				error={error}
				handleNewMessage={sendMessage}
				logo={imageSrc}
			/>
		</main>
	);
}
