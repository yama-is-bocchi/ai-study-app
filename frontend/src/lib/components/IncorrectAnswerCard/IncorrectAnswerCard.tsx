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
import MDEditor from "@uiw/react-md-editor";
import { useCallback, useReducer } from "react";
import type { Question } from "../../models/question";
import { incorrectAnswerCardReducer } from "./incorrectAnswerCardReducer";

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
	const [state, dispatch] = useReducer(incorrectAnswerCardReducer, {
		loading: false,
		isHovered: false,
		isOpenComment: true,
		comment: undefined,
	});

	const clickGetCommentary = useCallback(() => {
		dispatch({ type: "SET_LOADING", payload: true });
		dispatch({ type: "SET_COMMENT", payload: undefined });
		getCommentBehavior(question)
			.then((value) => {
				dispatch({ type: "SET_COMMENT", payload: value });
			})
			.finally(() => {
				dispatch({ type: "SET_LOADING", payload: false });
			});
	}, [getCommentBehavior, question]);
	const clickOpenComment = useCallback(
		() => dispatch({ type: "TOGGLE_IS_OPEN_COMMENT" }),
		[],
	);
	return (
		<Card
			style={{
				position: "relative",
				borderRadius: "16px",
				border: "1px solid black",
				boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
				margin: "22px",
				transition: "transform 0.2s ease-in-out",
				transform: state.isHovered ? "scale(1.03)" : "scale(1)",
			}}
			onMouseEnter={() => dispatch({ type: "SET_HOVERED", payload: true })}
			onMouseLeave={() => dispatch({ type: "SET_HOVERED", payload: false })}
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
				disabled={state.loading}
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
						color="secondary.9"
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
						color="secondary.9"
						px="md"
						py="xs"
					>
						<Text size="xl">正答</Text>
					</Badge>
					<Text style={{ textAlign: "center" }}>{question.answer}</Text>
				</Box>
			</Box>
			<Box style={{ textAlign: "center" }}>
				{state.loading ? (
					<Loader />
				) : (
					<Box>
						{state.comment ? (
							state.isOpenComment ? (
								<>
									<Box style={{ textAlign: "left" }}>
										<MDEditor.Markdown
											source={state.comment}
											style={{ textAlign: "left", padding: "10px" }}
										/>
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
