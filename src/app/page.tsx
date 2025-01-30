"use client";

import { Button } from "@/components/ui/button";
import { useCompletion } from "@/hooks/use-completion";
import { AlertCircle, CornerDownLeft, RefreshCcw } from "lucide-react";
import { useEffect, useMemo } from "react";
import { MicButton } from "./components/mic-button";

const systemPrompt = "You are a great story teller";
const prompt = "Tell me a story about a robot";

export default function Home() {
	const { messages, sendMessage, setSystemPrompt, reset, error } =
		useCompletion();

	const handleSendMessage = useMemo(
		() => (message: string) => sendMessage(message),
		[sendMessage],
	);
	const handleSendPrompt = () => sendMessage(prompt);

	useEffect(() => {
		setSystemPrompt(systemPrompt);
	}, [setSystemPrompt]);

	return (
		<main className="flex flex-col gap-6 h-svh  items-center p-10 overflow-y-auto">
			<div className="flex flex-col gap-4">
				{[{ role: "system", content: systemPrompt }, ...messages].map(
					(message, index) => (
						<div key={`${message.role}-${index}`} className="max-w-[500px]">
							<div className="opacity-50">{message.role}</div>
							<div className=" whitespace-pre-wrap">{message.content}</div>
						</div>
					),
				)}
			</div>
			{error && (
				<div className="flex justify-center items-center gap-3 bg-destructive text-destructive-foreground py-2 px-4 rounded-md">
					<AlertCircle className="w-4 h-4" />
					{error.message}
				</div>
			)}
			{messages.length <= 1 ? (
				<div className="flex justify-center gap-4">
					<Button onClick={handleSendPrompt}>
						<CornerDownLeft className="w-4 h-4" /> {prompt}
					</Button>
					<MicButton onTranscription={handleSendMessage} />
				</div>
			) : (
				<div className="flex justify-center mb-96 gap-4">
					<Button onClick={reset}>
						<RefreshCcw className="w-4 h-4" /> Restart
					</Button>
					<MicButton onTranscription={handleSendMessage} />
				</div>
			)}
		</main>
	);
}
