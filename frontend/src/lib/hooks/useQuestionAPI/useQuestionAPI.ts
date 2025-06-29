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
				.finally(() => {
					setLoading(false);
				});
		},
		[],
	);
	const registerAnswer = useCallback(
		(question: Question, isCorrect: boolean): Promise<KyResponse> => {
			setLoading(true);
			return postAnswer(question, isCorrect).finally(() => {
				setLoading(false);
			});
		},
		[],
	);
	return [loading, { getQuestion, registerAnswer }] as const;
}
