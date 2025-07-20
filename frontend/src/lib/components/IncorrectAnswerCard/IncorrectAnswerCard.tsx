import {
	Badge,
	Box,
	Button,
	Card,
	type CardProps,
	Loader,
	Text,
} from "@mantine/core";
import {
	IconChevronCompactDown,
	IconChevronCompactUp,
	IconMessageCircleSearch,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Question } from "../../models/question";

interface IncorrectAnswerCardProps extends CardProps {
	getCommentBehavior: (question: Question) => Promise<string>;
	question: Question;
	showFieldName: boolean;
}

export function IncorrectAnswerCard({
	getCommentBehavior,
	question,
	showFieldName = true,
	...props
}: IncorrectAnswerCardProps) {
	const [loading, setLoading] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [isOpenComment, setIsOpenComment] = useState(true);

	const [comment, setComment] = useState<string | undefined>(undefined);
	const clickGetCommentary = useCallback(() => {
		setLoading(true);
		setComment(undefined);
		getCommentBehavior(question)
			.then((value) => {
				setComment(value);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [getCommentBehavior, question]);
	const clickOpenComment = useCallback(
		() => setIsOpenComment((prev) => !prev),
		[],
	);
	return (
		<Card
			style={{
				position: "relative",
				borderRadius: "16px",
				fontFamily: "monospace",
				border: "1px solid black",
				boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
				margin: "22px",
				transition: "transform 0.2s ease-in-out",
				transform: isHovered ? "scale(1.03)" : "scale(1)",
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
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
					display: showFieldName ? "block" : "none",
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
					boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
				}}
				leftSection={<IconMessageCircleSearch />}
				onClick={clickGetCommentary}
				disabled={loading}
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
			<Box style={{ textAlign: "center" }}>
				{loading ? (
					<Loader />
				) : (
					<Box>
						{comment ? (
							isOpenComment ? (
								<>
									<Box style={{ textAlign: "left" }}>
										{comment.length > 0 ? (
											<Text size="28px">解説</Text>
										) : undefined}
										<ReactMarkdown remarkPlugins={[remarkGfm]}>
											{comment}
										</ReactMarkdown>
									</Box>
									<IconChevronCompactUp
										style={{ cursor: "pointer" }}
										onClick={clickOpenComment}
									/>
								</>
							) : (
								<IconChevronCompactDown
									style={{ cursor: "pointer" }}
									onClick={clickOpenComment}
								/>
							)
						) : undefined}
					</Box>
				)}
			</Box>
		</Card>
	);
}
