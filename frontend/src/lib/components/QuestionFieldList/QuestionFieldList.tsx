import { Box, type BoxProps, Group, Text } from "@mantine/core";
import {
	IconChevronCompactDown,
	IconChevronCompactUp,
} from "@tabler/icons-react";
import { useState } from "react";
import type { Question } from "../../models/question";
import { IncorrectAnswerCard } from "../IncorrectAnswerCard";

interface QuestionFieldListProps extends BoxProps {
	fieldName: string;
	getCommentBehavior: (question: Question) => Promise<string>;
	questionChildren: Question[];
}

export function QuestionFieldList({
	fieldName,
	getCommentBehavior,
	questionChildren,
	...props
}: QuestionFieldListProps) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<Box
				style={{
					border: "1px solid black",
					boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
					padding: "8px 12px",
					cursor: "pointer",
					userSelect: "none",
				}}
				onClick={() => setIsOpen(!isOpen)}
				{...props}
			>
				<Group justify="space-between" align="center">
					<Group gap="xs" align="center">
						<Text size="28px">{fieldName}</Text>
					</Group>
					{isOpen ? (
						<IconChevronCompactUp size={16} />
					) : (
						<IconChevronCompactDown size={16} />
					)}
				</Group>
			</Box>
			<Box
				style={{
					display: isOpen ? "block" : "none",
					border: "1px solid black",
					boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
					padding: "8px 12px",
					userSelect: "none",
					maxHeight: "1080px",
					overflowY: "auto",
					overflowX: "hidden",
				}}
			>
				{questionChildren.map((question, index) => (
					<IncorrectAnswerCard
						key={question.question + index.toString()}
						question={question}
						getCommentBehavior={getCommentBehavior}
						showFieldName={false}
					/>
				))}
			</Box>
		</>
	);
}
