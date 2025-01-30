import { useEffect, useMemo, useRef, useState } from "react";

export function usePlayAudio(audioBlob: Blob | null) {
	const [isPlaying, setIsPlaying] = useState(false);

	// currentTime in seconds (HTMLAudioElement exposes currentTime as seconds)
	const [currentTime, setCurrentTime] = useState(0);

	// total duration in seconds
	const [duration, setDuration] = useState(0);

	// We'll store the HTMLAudioElement in a ref so it remains stable.
	const audioRef = useRef<HTMLAudioElement | null>(null);

	// Generate an object URL for our Blob. We'll revoke it on cleanup.
	const audioUrl = useMemo(() => {
		if (!audioBlob) return null;
		return URL.createObjectURL(audioBlob);
	}, [audioBlob]);

	useEffect(() => {
		if (!audioUrl) {
			return;
		}

		const audio = new Audio(audioUrl);
		audioRef.current = audio;

		// Event listeners
		const handleTimeUpdate = () => {
			if (!audioRef.current) return;
			setCurrentTime(audioRef.current.currentTime);
		};

		const handleLoadedMetadata = () => {
			if (!audioRef.current) return;
			setDuration(audioRef.current.duration);
		};

		const handleEnded = () => {
			setIsPlaying(false);
			setCurrentTime(0);
		};

		audio.addEventListener("timeupdate", handleTimeUpdate);
		audio.addEventListener("loadedmetadata", handleLoadedMetadata);
		audio.addEventListener("ended", handleEnded);

		// Cleanup
		return () => {
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
			audio.removeEventListener("ended", handleEnded);
			audio.pause(); // just in case it's still playing
			audioRef.current = null;
			URL.revokeObjectURL(audioUrl);
		};
	}, [audioUrl]);

	// Public methods
	const playAudio = () => {
		if (!audioRef.current) return;
		audioRef.current.play();
		setIsPlaying(true);
	};

	const pauseAudio = () => {
		if (!audioRef.current) return;
		audioRef.current.pause();
		setIsPlaying(false);
	};

	const stopAudio = () => {
		if (!audioRef.current) return;
		audioRef.current.pause();
		audioRef.current.currentTime = 0;
		setIsPlaying(false);
		setCurrentTime(0);
	};

	// Derived values
	// Progress fraction from 0..1
	const progress = duration ? currentTime / duration : 0;

	// Current time in milliseconds
	const currentTimeMs = currentTime * 1000;

	// Duration in milliseconds
	const durationMs = duration * 1000;

	return {
		playAudio,
		pauseAudio,
		stopAudio,
		isPlaying,

		// raw time in seconds
		currentTime,

		// total duration in seconds
		duration,

		// fraction of how much audio has played (0..1)
		progress,

		// time in milliseconds
		currentTimeMs,

		// total duration in milliseconds
		durationMs,
	};
}
