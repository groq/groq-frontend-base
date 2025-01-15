import { Button } from "@/components/ui/button";

export default function Home() {
	const handleSendMessage = () => {
		// WIP: HERE
	};

	return (
		<div>
			<h1>Hello World</h1>
			<Button onClick={handleSendMessage}>Send Message</Button>
		</div>
	);
}
