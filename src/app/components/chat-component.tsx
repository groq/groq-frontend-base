import type { CompletionMessage } from "@/hooks/use-completion";
import { MarkdownBlock } from "@/components/ui/markdown-block";
import { AlertCircle, CornerDownLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { MicButton } from "./mic-button";
import Image from "next/image";

export function ChatComponent({
	messages,
	error,
	handleNewMessage,
	defaultPrompt,
	logo
}: {
	messages: CompletionMessage[];
	error?: Error | null;
	handleNewMessage: (message: string) => void;
	defaultPrompt: string;
	logo: string;
}) {
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [input, setInput] = useState(defaultPrompt);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		handleNewMessage(input);
		setInput("");
	};

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

	return (
		<div className="flex flex-col gap-6 h-svh items-center p-10 pb-6 overflow-y-auto w-full">
			<div><Image src={logo} alt="Background" width={200} height={200} className="" /></div>
			<div className=" w-full flex-1 overflow-y-auto" ref={chatContainerRef}>
				<div className="flex flex-col gap-4">
					{messages.map((message, index) => (
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
				<MicButton onTranscription={handleNewMessage} />
			</form>
		</div>
	);
}
