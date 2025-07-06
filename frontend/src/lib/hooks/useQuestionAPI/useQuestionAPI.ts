import { notifications } from "@mantine/notifications";
import type { KyResponse } from "ky";
import { useCallback, useState } from "react";
import {
	getCommentaryFromQuestion,
	getQuestions,
	postAnswer,
} from "../../api/question";
import type { OutputQuestion, Question } from "../../models/question";

export function useQuestionAPI(): [
	boolean,
	{
		getCommentary: (question: Question) => Promise<string>;
		getIncorrectAnswers: () => Promise<Question[]>;
		getQuestion: (mode: "ai" | "random") => Promise<OutputQuestion>;
		registerAnswer: (
			question: Question,
			isCorrect: boolean,
		) => Promise<KyResponse>;
	},
] {
	const [loading, setLoading] = useState(false);

	// 解説取得
	const getCommentary = useCallback((question: Question): Promise<string> => {
		setLoading(true);
		return getCommentaryFromQuestion(question)
			.then((response) => response.json<string>())
			.catch((error) => {
				console.error(`failed to fetch commentary: ${error}`);
				notifications.show({
					color: "red",
					title: "サーバーエラー",
					message: `解説の取得に失敗しました: ${error}`,
				});
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	// 誤答一覧取得
	const getIncorrectAnswers = useCallback((): Promise<Question[]> => {
		setLoading(true);
		return getQuestions("incorrect")
			.then((response) => response.json<Question[]>())
			.catch((error) => {
				console.error(`failed to fetch incorrect answers: ${error}`);
				notifications.show({
					color: "red",
					title: "サーバーエラー",
					message: `誤答一覧の取得に失敗しました: ${error}`,
				});
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	// 問題取得
	const getQuestion = useCallback(
		(mode: "ai" | "random"): Promise<OutputQuestion> => {
			setLoading(true);
			return getQuestions(mode)
				.then((response) => response.json<OutputQuestion>())
				.catch((error) => {
					console.error(`failed to fetch questions in ${mode} mode: ${error}`);
					notifications.show({
						color: "red",
						title: "サーバーエラー",
						message: `${mode}モードでの問題の取得が失敗しました: ${error}`,
					});
				})
				.finally(() => {
					setLoading(false);
				});
		},
		[],
	);
	// 回答登録
	const registerAnswer = useCallback(
		(question: Question, isCorrect: boolean): Promise<KyResponse> => {
			setLoading(true);
			return postAnswer(question, isCorrect)
				.catch((error) => {
					console.error(`failed to post answer data: ${error}`);
					notifications.show({
						color: "red",
						title: "サーバーエラー",
						message: `回答データの送信が失敗しました: ${error}`,
					});
				})
				.finally(() => {
					setLoading(false);
				});
		},
		[],
	);
	return [
		loading,
		{ getCommentary, getIncorrectAnswers, getQuestion, registerAnswer },
	] as const;
}
