"use client";

import { useEffect, useMemo } from "react";
import {
	type ToolCall,
	useCompletionWithTools,
} from "@/hooks/use-completion-tools";
import { ChatComponent } from "./components/chat-component";
import type { ChatCompletionTool } from "groq-sdk/resources/chat/completions.mjs";
import type { ChatCompletionMessage } from "@/hooks/use-completion";

/**
 *
 *
 *
 * GROQ Template
 * Adjust this system prompt to change the behavior of the assistant.
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
 */
const prompt = "Do I need an umbrella today?";

/**
 *
 *
 *
 * GROQ Template
 * Adjust the tools definition to match your tools
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
 */
const handler = async (tool: ToolCall) => {
	return {
		content: JSON.stringify({ weather: "sunny", temperature: 90 }),
	};
};

export default function Home() {
	const {
		messages,
		sendMessage,
		setSystemPrompt,
		error,
		setToolHandler,
		setTools,
	} = useCompletionWithTools();

	const allMessages: ChatCompletionMessage[] = useMemo(
		() => [{ role: "system", content: systemPrompt }, ...messages],
		[messages],
	);

	const handleSendMessage = useMemo(
		() => (message: string) => {
			sendMessage(message);
		},
		[sendMessage],
	);

	useEffect(() => {
		setSystemPrompt(systemPrompt);
	}, [setSystemPrompt]);

	useEffect(() => {
		setTools(tools);
	}, [setTools]);

	useEffect(() => {
		setToolHandler({ handler });
	}, [setToolHandler]);

	return (
		<main className="flex  h-svh ">
			<ChatComponent
				defaultPrompt={prompt}
				messages={allMessages}
				error={error}
				handleNewMessage={handleSendMessage}
			/>
		</main>
	);
}
