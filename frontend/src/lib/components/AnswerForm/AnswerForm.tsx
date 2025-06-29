import { Box, Button, Card, Stack, Text } from "@mantine/core";
import {
	IconCircle,
	IconMessageCircleSearch,
	IconStairsUp,
	IconX,
} from "@tabler/icons-react";
import type { Question } from "../../models/question";

interface AnswerFormProps {
	selectedAnswer: string;
	question: Question;
	clickNextBehavior: () => void;
}

export function AnswerForm({
	selectedAnswer,
	question,
	clickNextBehavior,
}: AnswerFormProps) {
	return (
		<Card
			style={{
				position: "relative",
				padding: "16px",
				borderRadius: "16px",
				textAlign: "center",
				fontFamily: "monospace",
				border: "1px solid black",
				boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
			}}
		>
			<Stack spacing="sm" p="10px">
				{selectedAnswer === question.answer ? (
					<>
						<Text size="28px" c="green" p="10px">
							正解 <IconCircle />
						</Text>
						<Box>正答 : {question.answer}</Box>
					</>
				) : (
					<>
						<Button
							leftSection={<IconMessageCircleSearch />}
							style={{
								position: "absolute",
								top: "10px",
								left: "10px",
							}}
						>
							解説
						</Button>
						<Text size="28px" c="red" p="10px">
							不正解 <IconX />
						</Text>

						<Box>正答 : {question.answer}</Box>
						<Box>あなたが選択した回答 : {selectedAnswer}</Box>
					</>
				)}
				<Box>
					<Button rightSection={<IconStairsUp />} onClick={clickNextBehavior}>
						次の問題
					</Button>
				</Box>
			</Stack>
		</Card>
	);
}
