// app/api/ask/route.ts
import Groq from "groq-sdk";
import type { NextRequest } from "next/server";

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

// If you want to run on the edge, you can export `export const runtime = 'edge'`
// but streaming also works on node runtimes.
// export const runtime = 'edge'

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const prompt = body.prompt;
		if (!prompt) {
			return new Response(JSON.stringify({ error: "Missing prompt" }), {
				status: 400,
			});
		}

		// Create a ReadableStream to handle SSE
		const encoder = new TextEncoder();
		// let streamClosed = false;

		const readableStream = new ReadableStream({
			async start(controller) {
				const response = await groq.chat.completions.create({
					model: "llama-3.3-70b-versatile",
					messages: [
						{ role: "system", content: "You are a helpful assistant." },
						{ role: "user", content: prompt },
					],
					stream: true,
				});

				for await (const chunk of response) {
					const content = chunk.choices[0]?.delta?.content ?? "";
					if (content) {
						controller.enqueue(encoder.encode(`data: ${content}\n\n`));
					}
				}

				controller.close();

				// // Handle streamed data from OpenAI
				// response.on("data", (chunk: Buffer) => {
				// 	const payloads = chunk.toString().split("\n\n");
				// 	for (const payload of payloads) {
				// 		if (payload.startsWith("data:")) {
				// 			const data = payload.replace(/data:\s*/, "");
				// 			if (data === "[DONE]") {
				// 				// Signal to the client that we’re done, then close the stream
				// 				controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
				// 				if (!streamClosed) {
				// 					controller.close();
				// 					streamClosed = true;
				// 				}
				// 				return;
				// 			}

				// 			try {
				// 				// Parse the JSON payload from OpenAI
				// 				const parsed = JSON.parse(data);
				// 				const content = parsed?.choices?.[0]?.delta?.content ?? "";
				// 				if (content) {
				// 					// Send partial content as SSE
				// 					controller.enqueue(encoder.encode(`data: ${content}\n\n`));
				// 				}
				// 			} catch (err) {
				// 				console.error("JSON parse error:", err);
				// 			}
				// 		}
				// 	}
				// });

				// // If the API call ends normally
				// response.data.on("end", () => {
				// 	if (!streamClosed) {
				// 		controller.close();
				// 		streamClosed = true;
				// 	}
				// });

				// // If there’s an error in the stream
				// response.data.on("error", (err: any) => {
				// 	console.error("Stream error:", err);
				// 	controller.error(err);
				// });
			},
		});

		// Return SSE response
		return new Response(readableStream, {
			headers: {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache, no-transform",
				Connection: "keep-alive",
				"X-Accel-Buffering": "no", // Useful for some hosting providers
			},
		});
	} catch (error) {
		console.error("API error:", error);
		return new Response(JSON.stringify({ error: "Something went wrong" }), {
			status: 500,
		});
	}
}
