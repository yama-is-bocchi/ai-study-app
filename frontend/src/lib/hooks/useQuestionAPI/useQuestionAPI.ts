import { notifications } from "@mantine/notifications";
import { useCallback, useState } from "react";
import {
	getCommentaryFromQuestion,
	getQuestions,
	postAnswer,
} from "../../api/question";
import type { OutputtedQuestion, Question } from "../../models/question";

export function useQuestionAPI() {
	const [loading, setLoading] = useState(false);

	// 解説取得
	const getCommentary = useCallback((question: Question): Promise<string> => {
		setLoading(true);
		return getCommentaryFromQuestion(question)
			.catch((error) => {
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
			.catch((error) => {
				notifications.show({
					color: "red",
					title: "サーバーエラー",
					message: `誤答一覧の取得に失敗しました: ${error}`,
				});
				return [];
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	// 問題取得
	const getQuestion = useCallback(
		(mode: "ai" | "random"): Promise<OutputtedQuestion> => {
			setLoading(true);
			return getQuestions(mode)
				.catch((error) => {
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
		(question: Question, isCorrect: boolean): Promise<void> => {
			setLoading(true);
			return postAnswer(question, isCorrect)
				.catch((error) => {
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
