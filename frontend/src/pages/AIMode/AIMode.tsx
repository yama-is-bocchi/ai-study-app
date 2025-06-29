import { Box } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useCallback, useEffect, useState } from "react";
import { RandomButtonBox } from "../../lib/components/RandomButtonBox";
import { YesMan } from "../../lib/components/YesMan";
import { useQuestionAPI } from "../../lib/hooks/useQuestionAPI";
import type { OutputQuestion } from "../../lib/models/question";

export default function AIMode() {
	const [loading, { getQuestion }] = useQuestionAPI();
	const [outputQuestion, setOutputQuestion] = useState<
		OutputQuestion | undefined
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
			) : (
				<>
					<Box style>
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
							// TODO: 正解,不正解の振る舞いを作成
							selectAnswerBehavior={() => {}}
						/>
					</Box>
				</>
			)}
		</div>
	);
}
