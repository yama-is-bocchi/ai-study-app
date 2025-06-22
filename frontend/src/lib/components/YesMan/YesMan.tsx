import { Box, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import yesman from "./../../../assets/yesman.png";
import yesmanGood from "./../../../assets/yesman-good.png";

type YesManState = "good" | "normal" | "question";

const yesmanImages: Record<YesManState, string> = {
	good: yesmanGood,
	normal: yesman,
	question: yesman,
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
			<Box style={{ textAlign: state === "question" ? "left" : "center" }}>
				<img
					src={yesmanImages[state]}
					alt={`yesman-${state}`}
					width={state === "question" ? 100 : 350}
				/>
			</Box>
			<Box
				style={{
					position: "relative",
					backgroundColor: "#000000",
					padding: "16px",
					borderRadius: "16px",
					textAlign: "center",
					boxShadow: "0 0 12px #00ff00, inset 0 0 6px #00ff00",
					color: "#00ff00",
					textShadow: "0 0 2px #00ff00",
					fontFamily: "monospace",
				}}
			>
				<div>
					{displayedMessages.map((message, index) => (
						<Text
							key={message + index.toString()}
							size={state === "question" ? "lg" : "md"}
							style={{ marginBottom: 8 }}
						>
							{message}
						</Text>
					))}
				</div>
			</Box>
		</div>
	);
}
