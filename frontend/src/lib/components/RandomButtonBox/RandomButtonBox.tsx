import { Button, Card, Loader } from "@mantine/core";
import { useEffect, useState } from "react";

interface RandomButtonBoxProps {
	answers: string[];
	selectAnswerBehavior: (current_answer: string) => void;
}

export function RandomButtonBox({
	answers,
	selectAnswerBehavior,
}: RandomButtonBoxProps) {
	const [shuffledAnswers, setShuffledAnswers] = useState<string[] | undefined>(
		undefined,
	);

	useEffect(() => {
		setShuffledAnswers([...answers].sort(() => Math.random() - 0.5));
	}, [answers]);

	return (
		<Card
			style={{
				fontFamily: "monospace",
				boxShadow: "#fff",
				padding: "30px",
			}}
		>
			{shuffledAnswers ? (
				shuffledAnswers.map((answer, index) => (
					<Button
						fullWidth
						leftSection={<>{(index + 1).toString()}.</>}
						key={answer + index.toString()}
						onClick={() => {
							selectAnswerBehavior(answer);
						}}
						style={{
							margin: "4px",
							borderRadius: "16px",
							minHeight: "60px",
						}}
					>
						{answer}
					</Button>
				))
			) : (
				<Loader />
			)}
		</Card>
	);
}
