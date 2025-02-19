"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, CornerDownLeft } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MicButton } from "./components/mic-button";
import { Input } from "@/components/ui/input";
import { MarkdownBlock } from "@/components/ui/markdown-block";
import { type ToolCall, useTools } from "@/hooks/use-tools";

const systemPrompt = `
You are a helpful assistant, colorful, fun and friendly. 
Answer everything as a very laid back person in a very informal way. 
The user is currently in San Francisco, California.`;

const prompt = "Do I need an umbrella today?";

const handler = async (tool: ToolCall) => {
	if (tool.name === "get_current_weather") {
		const { location } = tool.args;
		return {
			content: JSON.stringify({ weather: "sunny", temperature: 90, location }),
		};
	}
	return { content: "Unknown tool" };
};

export default function Home() {
	const [input, setInput] = useState(prompt);

	const {
		messages,
		sendMessage,
		setSystemPrompt,
		error,
		setToolHandler,
		setTools,
	} = useTools();

	const chatContainerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSendMessage = useMemo(
		() => (message: string) => {
			sendMessage(message);
			setInput("");
		},
		[sendMessage],
	);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		sendMessage(input);
		setInput("");
	};

	useEffect(() => {
		setSystemPrompt(systemPrompt);
	}, [setSystemPrompt]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: execute only when messages change
	useEffect(() => {
		// scroll to bottom
		const chatContainer = chatContainerRef.current;
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}, [messages]);

	// select input text when focused
	useEffect(() => {
		const input = inputRef.current;
		if (input) {
			input.select();
		}
	}, []);

	useEffect(() => {
		setTools([
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
		]);
	}, [setTools]);

	useEffect(() => {
		setToolHandler({ handler });
	}, [setToolHandler]);

	return (
		<main className="flex flex-col gap-6 h-svh  items-center p-10 pb-6 overflow-y-auto">
			<div className=" w-full flex-1 overflow-y-auto" ref={chatContainerRef}>
				<div className="flex flex-col gap-4">
					{[
						{ role: "system", content: systemPrompt, tool_calls: null },
						...messages,
					].map((message, index) => (
						<div
							key={`${message.role}-${index}`}
							className="max-w-[500px] last:mb-10"
						>
							<div className="opacity-50">{message.role}</div>
							<MarkdownBlock>
								{message.tool_calls ? "(using tool)" : message.content}
							</MarkdownBlock>
						</div>
					))}
				</div>
			</div>
			{error && (
				<div className="flex justify-center items-center gap-3 bg-destructive text-destructive-foreground py-2 px-4 rounded-md">
					<AlertCircle className="w-4 h-4" />
					{error.message}
				</div>
			)}
			<form
				className="flex justify-center gap-4 w-full"
				onSubmit={handleSubmit}
			>
				<Input
					placeholder="Enter a prompt"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className="flex-1 w-auto"
					autoFocus
					ref={inputRef}
				/>
				<Button type="submit">
					<CornerDownLeft className="w-4 h-4" /> Send
				</Button>
				<MicButton onTranscription={handleSendMessage} />
			</form>
		</main>
	);
}
