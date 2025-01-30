import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const client = new Groq({
	apiKey: GROQ_API_KEY,
});

async function transcribeAudio(
	audioBlob: Blob,
): Promise<Groq.Audio.Transcriptions.Transcription> {
	try {
		const arrayBuffer = await audioBlob.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const file = new File([buffer], "audio.webm", { type: "audio/webm" });

		const transcription = await client.audio.transcriptions.create({
			file,
			model: "whisper-large-v3-turbo",
			response_format: "text",
			language: "en",
		});

		return transcription;
	} catch (error) {
		console.error("Error transcribing audio:", error);
		throw error;
	}
}

export async function POST(request: Request) {
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
		const formData = await request.formData();
		const audioFile = formData.get("audio");

		if (!audioFile || !(audioFile instanceof Blob)) {
			return NextResponse.json(
				{ error: "No audio file provided" },
				{ status: 400 },
			);
		}

		const transcription = await transcribeAudio(audioFile);

		return NextResponse.json({
			transcription,
		});
	} catch (error) {
		console.error("Error processing audio:", error);
		return NextResponse.json(
			{ error: (error as Error).message || "Failed to process audio file" },
			{ status: 500 },
		);
	}
}
