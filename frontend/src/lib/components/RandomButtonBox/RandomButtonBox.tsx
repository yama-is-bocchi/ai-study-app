import { Box, Button } from "@mantine/core";
import { useMemo } from "react";

interface RandomButtonBoxProps {
	answers: string[];
	selectAnswerBehavior: () => void;
}

export function RandomButtonBox({
	answers,
	selectAnswerBehavior,
}: RandomButtonBoxProps) {
	const shuffledAnswers = useMemo(() => {
		return [...answers].sort(() => Math.random() - 0.5);
	}, [answers]);

	return (
		<>
			{shuffledAnswers.map((answer, index) => (
				<Box
					key={answer + index.toString()}
					style={{
						padding: "10px",
						backgroundColor: "black",
						color: "limegreen",
					}}
				>
					<Button
						fullWidth
						leftSection={<>{(index + 1).toString()}.</>}
						key={answer + index.toString()}
						onClick={selectAnswerBehavior}
						style={{
							backgroundColor: "black",
							color: "limegreen",
						}}
						styles={{
							root: {
								"&:hover": {
									backgroundColor: "#222",
									transform: "scale(1.03)",
									transition: "all 0.2s ease-in-out",
								},
							},
						}}
					>
						{answer}
					</Button>
				</Box>
			))}
		</>
	);
}
