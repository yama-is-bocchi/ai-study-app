import { Box, Stack } from "@mantine/core";
import { useCallback, useEffect, useReducer } from "react";
import { AnswerForm } from "../../lib/components/AnswerForm";
import { RandomButtonBox } from "../../lib/components/RandomButtonBox";
import { YesMan } from "../../lib/components/YesMan";
import { useQuestionAPI } from "../../lib/hooks/useQuestionAPI";
import { questionModeReducer } from "./questionModeReducer";

interface QuestionModeProps {
	mode: "ai" | "random";
}

export function QuestionMode({ mode }: QuestionModeProps) {
	const [loading, { getQuestion, registerAnswer }] = useQuestionAPI();
	const [state, dispatch] = useReducer(questionModeReducer, {
		outputtedQuestion: undefined,
		answeredQuestionData: undefined,
		selectedAnswer: "",
	});

	const refreshQuestions = useCallback(() => {
		getQuestion(mode).then((current_question) => {
			dispatch({ type: "SET_OUTPUTTED_QUESTION", payload: current_question });
		});
	}, [getQuestion, mode]);

	useEffect(() => {
		refreshQuestions();
	}, [refreshQuestions]);
	return (
		<>
			{loading || state.outputtedQuestion === undefined ? (
				<YesMan
					state={mode === "ai" ? "loader" : "loadFace"}
					messages={
						mode === "ai"
							? [
									"うーん、ちょっと待ってねっ！ボクが今、一生懸命データを読み取ってるところなんだ～！",
									"すぐ終わるから、そのままワクワクして待っててねっ！🔍",
								]
							: [
									"フフフ、何が出るかはボクにもわかんないよっ！でも、きっと楽しいはず～！",
									"今、ボクの脳内くじ引きが大回転中～～～！🎰",
								]
					}
				/>
			) : (
				<Stack spacing="sm" p="10px">
					<Box>
						<YesMan
							key={state.outputtedQuestion.question.answer}
							state="question"
							messages={[state.outputtedQuestion.question.question]}
						/>
					</Box>
					{state.answeredQuestionData === undefined ? (
						<Box>
							<RandomButtonBox
								answers={[
									state.outputtedQuestion.question.answer,
									...state.outputtedQuestion.dummy_answers,
								]}
								selectAnswerBehavior={(current_answer) => {
									dispatch({
										type: "SET_SELECTED_ANSWER",
										payload: current_answer,
									});
									dispatch({
										type: "SET_ANSWERED_QUESTION_DATA",
										payload: {
											answered: true,
											question: state.outputtedQuestion.question,
										},
									});
									// 回答データの送信
									registerAnswer(
										state.outputtedQuestion.question,
										current_answer === state.outputtedQuestion.question.answer,
									);
								}}
							/>
						</Box>
					) : (
						<AnswerForm
							selectedAnswer={state.selectedAnswer}
							question={state.outputtedQuestion.question}
							clickNextBehavior={() => {
								dispatch({
									type: "SET_ANSWERED_QUESTION_DATA",
									payload: undefined,
								});
								refreshQuestions();
							}}
						/>
					)}
				</Stack>
			)}
		</>
	);
}
