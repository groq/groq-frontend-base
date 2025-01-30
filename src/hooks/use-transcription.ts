import { useCallback, useState } from "react";

type UseTranscriptionOptions = {
	endpoint?: string; // If you still want configurability
};

export function useTranscription({
	endpoint = "/api/audio/transcriptions",
}: UseTranscriptionOptions = {}) {
	const [isTranscribing, setIsTranscribing] = useState(false);
	const [transcription, setTranscription] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const transcribeAudio = useCallback(
		async (audioBlob: Blob) => {
			setError(null);
			setIsTranscribing(true);

			const formData = new FormData();
			formData.append("audio", audioBlob);

			try {
				const response = await fetch(endpoint, {
					method: "POST",
					body: formData,
				});

				if (!response.ok) {
					// Try reading an error message or fall back
					const errorText = await response.text();
					throw new Error(errorText || "Transcription request failed.");
				}

				// Safely parse JSON
				let data: { transcription: string };
				try {
					data = await response.json();
				} catch {
					throw new Error("Could not parse response as JSON.");
				}

				if (!data || typeof data.transcription !== "string") {
					throw new Error("Response is missing the `transcription` field.");
				}

				// Store the transcription internally
				setTranscription(data.transcription);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("An unknown error occurred while sending the audio.");
				}
			} finally {
				setIsTranscribing(false);
			}
		},
		[endpoint],
	);

	return {
		transcribeAudio,
		transcription,
		isTranscribing,
		error,
	};
}
