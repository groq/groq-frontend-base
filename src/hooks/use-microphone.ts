import { useState, useRef, useEffect, useCallback } from "react";

export function useMicrophone() {
	const [isRecording, setIsRecording] = useState(false);
	const [isCapturing, setIsCapturing] = useState(false); // <-- New state
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
	const [error, setError] = useState<string | null>(null);

	const mediaRecorder = useRef<MediaRecorder | null>(null);
	const audioChunks = useRef<Blob[]>([]);

	const startRecording = useCallback(async (): Promise<void> => {
		setAudioBlob(null);
		setIsRecording(true);
		try {
			// (1) Request microphone access
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			// (2) Create MediaRecorder
			mediaRecorder.current = new MediaRecorder(stream);
			audioChunks.current = [];

			// (3) Listen for new data
			mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
				audioChunks.current.push(event.data);
			};

			// (4) When recording *starts*, set the isCapturing flag
			mediaRecorder.current.onstart = () => {
				setTimeout(() => {
					setIsCapturing(true);
				}, 1000); // delay to allow the browser to start capturing
			};

			// (5) When recording stops
			mediaRecorder.current.onstop = () => {
				setIsCapturing(false); // capturing stops
				const blob = new Blob(audioChunks.current, { type: "audio/webm" });
				setAudioBlob(blob);

				// Clean up the media stream
				for (const track of stream.getTracks()) {
					track.stop();
				}
			};

			// (6) Actually start recording
			mediaRecorder.current.start();
			setError(null);
		} catch (err) {
			setIsRecording(false);
			setError(`Error accessing microphone: ${(err as Error).message}`);
		}
	}, []);

	const stopRecording = (): void => {
		if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
			mediaRecorder.current.stop();
			setIsRecording(false);
		} else {
			throw new Error("No media recorder found");
		}
	};

	const toggleRecording = (): void => {
		if (isRecording) {
			stopRecording();
		} else {
			startRecording();
		}
	};

	useEffect(() => {
		if (isRecording) {
			startRecording();
		}
	}, [isRecording, startRecording]);

	return {
		isRecording, // "user wants to record" state
		isCapturing, // browser is *actually* capturing audio
		toggleRecording,
		audioBlob,
		error,
	};
}
