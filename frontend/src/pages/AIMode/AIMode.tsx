import { Box } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useCallback, useEffect, useState } from "react";
import { RandomButtonBox } from "../../lib/components/RandomButtonBox";
import { YesMan } from "../../lib/components/YesMan";
import { useQuestionAPI } from "../../lib/hooks/useQuestionAPI";
import type { OutputQuestion, Question } from "../../lib/models/question";

export default function AIMode() {
	const [loading, { getQuestion }] = useQuestionAPI();
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

	const refreshQuestions = useCallback(() => {
		getQuestion("ai")
			.then((current_question) => {
				setOutputQuestion(current_question);
			})
			.catch((error) => {
				console.error(`failed to send get request at ai mode question${error}`);
				notifications.show({
					color: "red",
					title: "サーバーエラー",
					message: `サーバーへのリクエストが失敗しました${error}`,
				});
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
			) : answeredQuestionData === undefined ? (
				<>
					<Box style={{padding:"10px"}}>
						<YesMan
							key={outputQuestion.question.answer}
							state="question"
							messages={[outputQuestion.question.question]}
						/>
					</Box>
					<Box>
						<RandomButtonBox
							answers={[
								outputQuestion.question.answer,
								...outputQuestion.dummy_answers,
							]}
							selectAnswerBehavior={() => {
								setAnsweredQuestionData({
									answered: true,
									question: outputQuestion.question,
								});
							}}
						/>
					</Box>
				</>
			) : (
        // TODO:回答データの送信,解説依頼
				<></>
			)}
		</div>
	);
}
