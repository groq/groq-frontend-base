import { useTheme } from "next-themes";
import Image from "next/image";

export function PoweredByGroq() {
	const { theme } = useTheme(); // Get the current theme

	// Select the image based on the theme
	const imageSrc = theme === "dark" ? "/pbg-white.png" : "/pbg-color.png";
	return (
		<div className="flex justify-center items-center py-4">
			<Image src={imageSrc} alt="Powered by Groq" width={100} height={100} />
		</div>
	);
}
