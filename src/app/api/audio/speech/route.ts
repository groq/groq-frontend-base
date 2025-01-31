import type { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

async function transcribeAudio(text: string) {
	console.log({ key: process.env.OPENAI_API_KEY });
	const mp3 = await openai.audio.speech.create({
		model: "tts-1",
		voice: "nova",
		input: text,
		speed: 1.25,
	});
	const buffer = Buffer.from(await mp3.arrayBuffer());
	return buffer;
}

export async function POST(req: NextRequest) {
	const { text } = await req.json();
	const buffer = await transcribeAudio(text);

	return new Response(buffer, {
		status: 200,
		headers: {
			"Content-Type": "audio/mpeg",
			"Content-Length": buffer.length.toString(),
		},
	});
}
