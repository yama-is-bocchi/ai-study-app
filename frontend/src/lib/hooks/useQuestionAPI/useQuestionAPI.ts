import { useCallback, useState } from "react";
import { getQuestions } from "../../api/question";
import type { Question } from "../../models/questions";

export function useQuestionAPI(): [
	boolean,
	{
		getQuestion: (mode: "ai" | "random") => Promise<Question[]>;
	},
] {
	const [loading, setLoading] = useState(false);

	// 問題取得
	const getQuestion = useCallback(
		(mode: "ai" | "random"): Promise<Question[]> => {
			setLoading(true);
			return getQuestions(mode)
				.then((response) => response.json<Question[]>())
				.finally(() => {
					setLoading(false);
				});
		},
		[],
	);
	return [loading, { getQuestion }] as const;
}
