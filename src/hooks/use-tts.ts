import { useCallback } from "react";

export function useTTS() {
	const tts = useCallback(async (text: string) => {
		const response = await fetch("/api/audio/speech", {
			method: "POST",
			body: JSON.stringify({ text }),
		});
		const blob = await response.blob();
		return blob;
	}, []);

	return { tts };
}
