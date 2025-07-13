import { Badge, Box, Button, Card, type CardProps, Text } from "@mantine/core";
import { IconMessageCircleSearch } from "@tabler/icons-react";
import { useState } from "react";
import type { Question } from "../../models/question";

interface IncorrectAnswerCardProps extends CardProps {
	getCommentBehavior: (question: Question) => Promise<string>;
	question: Question;
	needFieldName: boolean;
}

export function IncorrectAnswerCard({
	getCommentBehavior,
	question,
	needFieldName,
	...props
}: IncorrectAnswerCardProps) {
	const [loading, setLoading] = useState<boolean>(false);
	return (
		<Card
			style={{
				position: "relative",
				borderRadius: "16px",
				fontFamily: "monospace",
				border: "1px solid black",
				boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
				margin: "15px",
			}}
			{...props}
		>
			<Box
				style={{
					position: "absolute",
					top: "10px",
					left: "10px",
					border: "1px solid black",
					boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
					color: "#888",
					padding: "5px",
				}}
			>
				<Text color="black" size="sm">
					フィールド名
				</Text>
				<Text color="black">{question.field_name}</Text>
			</Box>

			<Button
				style={{
					position: "absolute",
					top: "10px",
					right: "30px",
				}}
				leftSection={<IconMessageCircleSearch />}
			>
				解説
			</Button>
			<Text
				color="black"
				style={{
					position: "absolute",
					top: "55px",
					right: "30px",
				}}
			>
				{`回答日: ${new Date(question.timestamp).toLocaleDateString("ja-JP", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
				})}`}
			</Text>
			<Box
				style={{
					padding: "20px",
					marginTop: "50px",
				}}
			>
				<Box
					style={{
						textAlign: "left",
						border: "1px solid black",
						marginBottom: "10px",
						padding: "5px",
						boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
					}}
				>
					<Badge
						style={{
							boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
						}}
						color="gray"
						px="md"
						py="xs"
					>
						<Text size="xl">問題文</Text>
					</Badge>
					<Text style={{ textAlign: "center" }}>{question.question}</Text>
				</Box>
				<Box
					style={{
						textAlign: "left",
						border: "1px solid black",
						marginBottom: "10px",
						padding: "5px",
						boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
					}}
				>
					<Badge
						style={{
							boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
						}}
						color="gray"
						px="md"
						py="xs"
					>
						<Text size="xl">正答</Text>
					</Badge>
					<Text style={{ textAlign: "center" }}>{question.answer}</Text>
				</Box>
			</Box>
		</Card>
	);
}
