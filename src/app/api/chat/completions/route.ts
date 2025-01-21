import Groq from "groq-sdk";
import type { NextRequest } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const groq = new Groq({
	apiKey: GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
	if (!GROQ_API_KEY) {
		return new Response(
			JSON.stringify({
				error: "GROQ_API_KEY not found on environment variables.",
			}),
			{
				status: 500,
			},
		);
	}

	try {
		const body = await req.json();
		const { messages } = body;
		if (!messages) {
			return new Response(JSON.stringify({ error: "Missing prompt" }), {
				status: 400,
			});
		}

		const encoder = new TextEncoder();

		const readableStream = new ReadableStream({
			async start(controller) {
				const response = await groq.chat.completions.create({
					model: "llama-3.3-70b-specdec",
					messages,
					stream: true,
				});

				for await (const chunk of response) {
					const text = chunk.choices[0]?.delta?.content ?? "";
					if (text) {
						controller.enqueue(
							encoder.encode(`data: ${JSON.stringify({ text })}\n\n`),
						);
					}
				}

				controller.enqueue(
					encoder.encode(`data: ${JSON.stringify({ text: "[DONE]" })}\n\n`),
				);
				controller.close();
			},
		});

		return new Response(readableStream, {
			headers: {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache, no-transform",
				Connection: "keep-alive",
				"X-Accel-Buffering": "no",
			},
		});
	} catch (error) {
		console.error("API error:", error);
		return new Response(JSON.stringify({ error: "Something went wrong" }), {
			status: 500,
		});
	}
}
