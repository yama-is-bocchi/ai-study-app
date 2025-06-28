import { Box } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useCallback, useEffect, useState } from "react";
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
				// TODO: 回答欄の割り当て方法を考察する.
				<Box>
					<YesMan
						key={outputQuestion.question.answer}
						state="question"
						messages={[outputQuestion.question]}
					/>
				</Box>
			)}
		</div>
	);
}
