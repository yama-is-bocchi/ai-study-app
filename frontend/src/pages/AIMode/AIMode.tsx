import { Box, Stack } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { AnswerForm } from "../../lib/components/AnswerForm";
import { RandomButtonBox } from "../../lib/components/RandomButtonBox";
import { YesMan } from "../../lib/components/YesMan";
import { useQuestionAPI } from "../../lib/hooks/useQuestionAPI";
import type { OutputQuestion, Question } from "../../lib/models/question";

export default function AIMode() {
	const [loading, { getQuestion, registerAnswer }] = useQuestionAPI();
	const [outputQuestion, setOutputQuestion] = useState<
		OutputQuestion | undefined
	>(undefined);
	const [answeredQuestionData, setAnsweredQuestionData] = useState<
		| {
				answered: boolean;
				question: Question;
		  }
		| undefined
	>(undefined);
	const [selectedAnswer, setSelectedAnswer] = useState("");

	const refreshQuestions = useCallback(() => {
		getQuestion("ai").then((current_question) => {
			setOutputQuestion(current_question);
		});
	}, [getQuestion]);

	useEffect(() => {
		refreshQuestions();
	}, [refreshQuestions]);
	return (
		<div>
			{loading || outputQuestion === undefined ? (
				<YesMan
					state="good"
					messages={[
						"うーん、ちょっと待ってねっ！ボクが今、一生懸命データを読み取ってるところなんだ～！",
						"すぐ終わるから、そのままワクワクして待っててねっ！🔍",
					]}
				/>
			) : (
				<Stack spacing="sm" p="10px">
					<Box>
						<YesMan
							key={outputQuestion.question.answer}
							state="question"
							messages={[outputQuestion.question.question]}
						/>
					</Box>
					{answeredQuestionData === undefined ? (
						<Box>
							<RandomButtonBox
								answers={[
									outputQuestion.question.answer,
									...outputQuestion.dummy_answers,
								]}
								selectAnswerBehavior={(current_answer) => {
									setSelectedAnswer(current_answer);
									setAnsweredQuestionData({
										answered: true,
										question: outputQuestion.question,
									});
									// 回答データの送信
									registerAnswer(
										outputQuestion.question,
										current_answer === outputQuestion.question.answer,
									);
								}}
							/>
						</Box>
					) : (
						<AnswerForm
							selectedAnswer={selectedAnswer}
							question={outputQuestion.question}
							clickNextBehavior={() => {}}
						/>
					)}
				</Stack>
			)}
		</div>
	);
}
