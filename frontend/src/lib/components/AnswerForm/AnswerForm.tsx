import { Box, Button, Card, Loader, Stack, Text } from "@mantine/core";
import {
	IconCircle,
	IconMessageCircleSearch,
	IconStairsUp,
	IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useQuestionAPI } from "../../hooks/useQuestionAPI";
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
	const [loading, { getCommentary }] = useQuestionAPI();
	const [commentary, setCommentary] = useState("");
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
							onClick={() => {
								setCommentary("");
								getCommentary(question).then((comment) => {
									setCommentary(comment);
								});
							}}
							disabled={loading}
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
					<Box
						style={
							commentary.length > 0
								? {
										padding: "20px",
										backgroundColor: "#f9f9f9",
										borderRadius: "8px",
										border: "1px solid #ddd",
										boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
									}
								: undefined
						}
					>
						{loading ? <Loader /> : undefined}
						<Box style={{ textAlign: "left" }}>
							{commentary.length > 0 ? (
								<Text size="28px">解説</Text>
							) : undefined}
							<ReactMarkdown>{commentary}</ReactMarkdown>
						</Box>
					</Box>
					<Button
						style={{ marginTop: "10px" }}
						rightSection={<IconStairsUp />}
						onClick={clickNextBehavior}
					>
						次の問題
					</Button>
				</Box>
			</Stack>
		</Card>
	);
}
