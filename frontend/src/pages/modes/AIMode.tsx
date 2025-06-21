import { notifications } from "@mantine/notifications";
import { useCallback, useEffect, useState } from "react";
import { YesMan } from "../../lib/components/YesMan";
import { useQuestionAPI } from "../../lib/hooks/useQuestionAPI";
import type { Question } from "../../lib/models/questions";

export default function AIMode() {
	const [loading, { getQuestion }] = useQuestionAPI();
	const [questions, setQuestion] = useState<Question[] | undefined>(undefined);

	const refreshQuestions = useCallback(() => {
		getQuestion("ai")
			.then((current_question) => {
				setQuestion(current_question);
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
		// TODO:無限ループ
	}, [refreshQuestions]);
	return (
		<div>
			{loading || questions === undefined ? (
				<YesMan
					state="good"
					messages={[
						"うーん、ちょっと待ってねっ！ボクが今、一生懸命データを読み取ってるところなんだ～！",
						"すぐ終わるから、そのままワクワクして待っててねっ！🔍",
					]}
				/>
			) : (
				<div>
					{questions ? questions.map((question) => <>{question}</>) : ""}
				</div>
			)}
		</div>
	);
}
