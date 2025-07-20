import { Box, Text } from "@mantine/core";
import { useEffect, useReducer, useState } from "react";
import yesman from "./../../../assets/yesman.png";
import yesmanGood from "./../../../assets/yesman-good.png";
import yesmanLoadFace from "./../../../assets/yesman-load-face.png";
import yesmanLoader from "./../../../assets/yesman-loader.png";
import { yesManReducer } from "./yesManReducer";

type YesManState = "good" | "normal" | "question" | "loader" | "loadFace";

const yesmanImages: Record<YesManState, string> = {
	good: yesmanGood,
	normal: yesman,
	question: yesman,
	loader: yesmanLoader,
	loadFace: yesmanLoadFace,
};

interface YesManProps {
	state: YesManState;
	messages: string[];
}

export function YesMan({ state, messages }: YesManProps) {
	const [componentState, dispatch] = useReducer(yesManReducer, {
		displayedMessages: [],
		currentLine: 0,
		charIndex: 0,
	});

	useEffect(() => {
		if (componentState.currentLine >= messages.length) return;

		const fullText = messages[componentState.currentLine];
		const currentText =
			componentState.displayedMessages[componentState.currentLine] || "";

		if (componentState.charIndex < fullText.length) {
			const timeout = setTimeout(() => {
				const updatedLine = currentText + fullText[componentState.charIndex];
				const updatedMessages = [...componentState.displayedMessages];
				updatedMessages[componentState.currentLine] = updatedLine;
				dispatch({ type: "SET_DISPLAYED_MESSAGES", payload: updatedMessages });
				dispatch({
					type: "SET_CHAR_INDEX",
					payload: componentState.charIndex + 1,
				});
			}, 40);
			return () => clearTimeout(timeout);
		}
		if (componentState.currentLine + 1 < messages.length) {
			setTimeout(() => {
				dispatch({ type: "INCREMENT_CURRENT_LINE" });
				dispatch({
					type: "SET_CHAR_INDEX",
					payload: 0,
				});
			}, 400);
		}
	}, [componentState.charIndex, componentState.currentLine, messages]);

	return (
		<>
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
				{componentState.displayedMessages.map((message, index) => (
					<Text
						key={message + index.toString()}
						size={state === "question" ? "lg" : "md"}
						style={{ marginBottom: 8 }}
					>
						{message}
					</Text>
				))}
			</Box>
		</>
	);
}
