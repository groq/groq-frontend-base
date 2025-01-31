"use client";

import { Button } from "@/components/ui/button";
import { useCompletion } from "@/hooks/use-completion";
import { AlertCircle, CornerDownLeft } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MicButton } from "./components/mic-button";
import { Input } from "@/components/ui/input";
import { MarkdownBlock } from "@/components/ui/markdown-block";
import { useTTS } from "@/hooks/use-tts";

const systemPrompt = `You are an excellent trip planner. 
  Respond only with the information the user requests, without unnecessary details. 
  Always include a friendly, concise commentary at the end of your response. 
  The commentary should be engaging and encourage the user to ask for more or take action. 
  Enclose the commentary within <Commentary></Commentary> tags. 
  Keep it short, as it will be read aloud to the user.`;

const prompt = "Make a table schedule for a trip to Japan";

export default function Home() {
	const [input, setInput] = useState(prompt);
	const [commentary, setCommentary] = useState("");
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
	const { tts } = useTTS();

	const { messages, sendMessage, setSystemPrompt, error } = useCompletion();

	const chatContainerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const dispatchMessage = useMemo(
		() => (message: string) => {
			sendMessage(message).then((responseMessage) => {
				const [msg, commentary] = extractCommentary(responseMessage);
				console.log({ msg, commentary });
				if (commentary) {
					setCommentary(commentary);
					tts(commentary).then(setAudioBlob);
				}
			});
			setInput("");
		},
		[sendMessage, tts],
	);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatchMessage(input);
	};

	useEffect(() => {
		setSystemPrompt(systemPrompt);
	}, [setSystemPrompt]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: execute only when messages change
	useEffect(() => {
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
		if (audioBlob) {
			const audio = new Audio(URL.createObjectURL(audioBlob));
			audio.play();
		}
	}, [audioBlob]);

	return (
		<div className="flex gap-3 h-svh">
			<main className="flex flex-col flex-1 gap-6 h-svh  items-center p-10 pb-6 overflow-y-auto">
				<div className=" w-full flex-1 overflow-y-auto" ref={chatContainerRef}>
					<div className="flex flex-col gap-4">
						{[{ role: "system", content: systemPrompt }, ...messages].map(
							(message, index) => (
								<div
									key={`${message.role}-${index}`}
									className="max-w-[500px] last:mb-10"
								>
									<div className="opacity-50">{message.role}</div>
									<MarkdownBlock>
										{extractCommentary(message.content || "")?.[0] || ""}
									</MarkdownBlock>
								</div>
							),
						)}
					</div>
				</div>
				{error && (
					<div className="flex justify-center items-center gap-3 bg-destructive text-destructive-foreground py-2 px-4 rounded-md">
						<AlertCircle className="w-4 h-4" />
						{error.message}
					</div>
				)}
				<div className="flex justify-center gap-4 w-full">
					<form
						className="flex-1 flex justify-center gap-4 w-full"
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
					</form>
					<MicButton onTranscription={dispatchMessage} />
				</div>
			</main>
			<aside className="bg-green-700 w-[300px] p-6 overflow-y-auto">
				<div className="">{commentary}</div>
			</aside>
		</div>
	);
}

const commentaryRegex = /<Commentary>([\s\S]*?)<\/Commentary>/;

function extractCommentary(message: string): [string, string] {
	const commentaryMatch = message.match(commentaryRegex);
	if (!commentaryMatch) return [message.trim(), ""];

	const commentary = commentaryMatch[1].trim();
	const messageWithoutCommentary = message.replace(commentaryRegex, "").trim();

	return [messageWithoutCommentary, commentary];
}
