import { notifications } from "@mantine/notifications";
import type { KyResponse } from "ky";
import { useCallback, useState } from "react";
import { getQuestions, postAnswer } from "../../api/question";
import type { OutputQuestion, Question } from "../../models/question";

export function useQuestionAPI(): [
	boolean,
	{
		getQuestion: (mode: "ai" | "random") => Promise<OutputQuestion>;
		registerAnswer: (
			question: Question,
			isCorrect: boolean,
		) => Promise<KyResponse>;
	},
] {
	const [loading, setLoading] = useState(false);

	// 問題取得
	const getQuestion = useCallback(
		(mode: "ai" | "random"): Promise<OutputQuestion> => {
			setLoading(true);
			return getQuestions(mode)
				.then((response) => response.json<OutputQuestion>())
				.catch((error) => {
					console.error(`failed  to fetch questions in ${mode} mode: ${error}`);
					notifications.show({
						color: "red",
						title: "サーバーエラー",
						message: `${mode}モードでの問題の取得が失敗しました${error}`,
					});
				})
				.finally(() => {
					setLoading(false);
				});
		},
		[],
	);
	const registerAnswer = useCallback(
		(question: Question, isCorrect: boolean): Promise<KyResponse> => {
			setLoading(true);
			return postAnswer(question, isCorrect)
				.catch((error) => {
					console.error(`failed to post answer data: ${error}`);
					notifications.show({
						color: "red",
						title: "サーバーエラー",
						message: `回答データの送信が失敗しました${error}`,
					});
				})
				.finally(() => {
					setLoading(false);
				});
		},
		[],
	);
	return [loading, { getQuestion, registerAnswer }] as const;
}
