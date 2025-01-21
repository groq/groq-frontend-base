"use client";

import { Button } from "@/components/ui/button";
import { useCompletion } from "@/hooks/use-completion";
import { AlertCircle, CornerDownLeft, RefreshCcw } from "lucide-react";
import { useEffect } from "react";

const systemPrompt = "You are a great haiku writer";
const prompt = "Write a haiku about ai";

export default function Home() {
	const { messages, sendMessage, setSystemPrompt, reset, error } =
		useCompletion();

	const handleSendMessage = () => {
		sendMessage(prompt);
	};

	useEffect(() => {
		setSystemPrompt(systemPrompt);
	}, [setSystemPrompt]);

	return (
		<main className="flex flex-col gap-6 h-svh justify-center items-center p-10">
			<div className="flex flex-col gap-4">
				{messages.map((message, index) => (
					<div key={`${message.role}-${index}`}>
						<div className="opacity-50">{message.role}</div>
						<div className=" whitespace-pre">{message.content}</div>
					</div>
				))}
			</div>
			{error && (
				<div className="flex justify-center items-center gap-3 bg-destructive text-destructive-foreground py-2 px-4 rounded-md">
					<AlertCircle className="w-4 h-4" />
					{error.message}
				</div>
			)}
			{messages.length <= 1 ? (
				<div className="flex justify-center">
					<Button onClick={handleSendMessage}>
						<CornerDownLeft className="w-4 h-4" /> {prompt}
					</Button>
				</div>
			) : (
				<div className="flex justify-center">
					<Button onClick={reset}>
						<RefreshCcw className="w-4 h-4" /> Restart
					</Button>
				</div>
			)}
		</main>
	);
}
