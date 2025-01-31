import type { ChatCompletionMessage } from "@/hooks/use-completion";

const youAre =
	"You are an helpful companion that helps the user accomplish their goal.";

export function useCommentary() {
	const getCommentary = async (messages: ChatCompletionMessage[]) => {
		if (messages.length < 2) return "";

		if (messages.length === 2) {
			return await sendMessage(
				messages,
				`
        ${youAre}
  
        The User asked:
        <UserQuestion>
          ${messages[0].content}
        </UserQuestion>
  
        The Assistant answered:
        <AssistantAnswer>
          ${messages[1].content}
        </AssistantAnswer>
  
        Please provide a commentary on the result you provided. 
        Be very succint, friendly and helpful.
        Start friendly but to the point.
        Act as a companion, not an assistant.
      `,
			);
		}

		if (messages[messages.length - 1].role === "assistant") {
			return await sendMessage(
				messages,
				`
        ${youAre}

        The user read:
        <UserRead>
          ${messages[messages.length - 3].content}
        </UserRead>

        The User asked:
        <UserQuestion>
          ${messages[messages.length - 2].content}
        </UserQuestion>

        The Assistant answered:
        <AssistantAnswer>
          ${messages[messages.length - 1].content}
        </AssistantAnswer>

        - Please provide a commentary on the result you provided.
        - Comment on the difference between the 
        user's question and the your answer. 
        - Act as a companion, not an assistant.
        - Be very succint, friendly and helpful.  
        - Don't be apologetic, you did it successfully.
        - Don't sound repetitive, you are a companion.
      `,
			);
		}
		return "";
	};

	return { getCommentary };
}

export async function sendMessage(
	messages: ChatCompletionMessage[],
	prompt: string,
	{ model = "llama-3.3-70b-specdec" }: { model?: string } = {},
): Promise<string> {
	try {
		const response = await fetch("/api/chat/completions", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				messages: [...messages, { role: "user", content: prompt }],
				model,
			}),
		});

		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`);
		}

		const reader = response.body?.getReader();
		if (!reader) {
			throw new Error("No readable stream available");
		}

		let result = "";
		const decoder = new TextDecoder();

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			const lines = decoder.decode(value, { stream: true }).split("\n\n");

			for (const line of lines) {
				if (line.startsWith("data: ")) {
					const data = line.slice("data: ".length);
					const { text } = JSON.parse(data);
					if (text !== "[DONE]") {
						result += text;
					}
				}
			}
		}

		return result;
	} catch (error) {
		console.error("sendMessage error:", error);
		throw error;
	}
}
