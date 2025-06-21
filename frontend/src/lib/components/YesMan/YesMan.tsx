import { Box } from "@mantine/core";
import { useEffect, useState } from "react";
import yesman from "./../../../assets/yesman.png";
import yesmanGood from "./../../../assets/yesman-good.png";

type YesManState = "good" | "normal";

const yesmanImages: Record<YesManState, string> = {
	good: yesmanGood,
	normal: yesman,
};

interface YesManProps {
	state: YesManState;
	messages: string[];
}

export function YesMan({ state, messages }: YesManProps) {
	const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
	const [currentLine, setCurrentLine] = useState(0);
	const [charIndex, setCharIndex] = useState(0);

	useEffect(() => {
		if (currentLine >= messages.length) return;

		const fullText = messages[currentLine];
		const currentText = displayedMessages[currentLine] || "";

		if (charIndex < fullText.length) {
			const timeout = setTimeout(() => {
				const updatedLine = currentText + fullText[charIndex];
				const updatedMessages = [...displayedMessages];
				updatedMessages[currentLine] = updatedLine;
				setDisplayedMessages(updatedMessages);
				setCharIndex((prev) => prev + 1);
			}, 40);
			return () => clearTimeout(timeout);
		}
		if (currentLine + 1 < messages.length) {
			setTimeout(() => {
				setCurrentLine((prev) => prev + 1);
				setCharIndex(0);
			}, 400);
		}
	}, [charIndex, currentLine, displayedMessages, messages]);

	return (
		<div>
			<Box>
				<img src={yesmanImages[state]} alt={`yesman-${state}`} width={350} />
			</Box>

			<Box
				style={{
					position: "relative",
					backgroundColor: "#f1f1f1",
					padding: "16px",
					borderRadius: "16px",
					textAlign: "center",
					boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.1)",
				}}
			>
				<div>
					{displayedMessages.map((message, index) => (
						<h5 key={message + index.toString()} style={{ margin: "0 0 8px" }}>
							{message}
						</h5>
					))}
				</div>
			</Box>
		</div>
	);
}
