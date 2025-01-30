import { Button } from "@/components/ui/button";
import { useMicrophone } from "@/hooks/use-microphone";
import { useTranscription } from "@/hooks/use-transcription";
import { LoaderCircle, Mic, Play, Square } from "lucide-react";
import { useEffect } from "react";
import { usePlayAudio } from "@/hooks/use-play-audio";

export function MicButton({
	onTranscription,
}: { onTranscription: (text: string) => void }) {
	const { isRecording, toggleRecording, audioBlob, isCapturing } =
		useMicrophone();
	const { transcribeAudio, transcription } = useTranscription();
	const { playAudio, isPlaying, stopAudio } = usePlayAudio(audioBlob);

	useEffect(() => {
		if (audioBlob) {
			transcribeAudio(audioBlob);
		}
	}, [audioBlob, transcribeAudio]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Can't rely on onTranscription being stable
	useEffect(() => {
		if (transcription) {
			onTranscription(transcription);
		}
	}, [transcription]);

	return (
		<div className="flex items-center gap-1">
			<Button
				size="icon"
				onClick={toggleRecording}
				className={`${
					isCapturing
						? "animate-[pulse_0.4s_ease-in-out_infinite] bg-orange-500 text-white hover:bg-orange-500 hover:text-white"
						: ""
				}`}
			>
				{isRecording && !isCapturing ? (
					<LoaderCircle size={16} className="animate-spin" />
				) : (
					<Mic size={16} />
				)}
			</Button>
			{audioBlob && (
				<Button size="icon" onClick={isPlaying ? stopAudio : playAudio}>
					{isPlaying ? <Square size={16} /> : <Play size={16} />}
				</Button>
			)}
		</div>
	);
}
