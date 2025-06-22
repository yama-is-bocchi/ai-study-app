import { Box } from "@mantine/core";
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
				questions.map((question, index) => (
					<>
						{index === 0 ? (
							<>
								<Box>
									<YesMan
										key={question + index.toString()}
										state="question"
										messages={[question.question]}
									/>
								</Box>
								<h2 key={question + index.toString()}>{question.answer}</h2>
							</>
						) : (
							<h2 key={question + index.toString()}>{question.answer}</h2>
						)}
					</>
				))
			)}
		</div>
	);
}
