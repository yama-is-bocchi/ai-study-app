import { notifications } from "@mantine/notifications";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { AnswerMapByFields } from "../../models/answer";
import type { Question } from "../../models/question";
import { useQuestionAPI } from "../useQuestionAPI";

/** パラメータ名に対応する値は field | all である必要があります。 */
export function useAnswerCollector(urlParamName: string): [
	boolean,
	{
		mode: string | null;
		getAnswers: () => Question[];
		getAnswerMap: () => AnswerMapByFields;
	},
] {
	const [searchParams] = useSearchParams();
	const [loading, { getIncorrectAnswers }] = useQuestionAPI();
	const [answerData, setAnswerData] = useState<Question[]>([]);

	const mode = searchParams.get(urlParamName);

	const getAnswerMap = useCallback(
		(): AnswerMapByFields =>
			answerData.reduce((accumulator, question) => {
				const questions = accumulator.get(question.field_name);
				if (questions) {
					questions.push(question);
				} else {
					accumulator.set(question.field_name, [question]);
				}
				return accumulator;
			}, new Map<string, Question[]>()),
		[answerData],
	);
	const getAnswers = useCallback((): Question[] => answerData);

	useEffect(() => {
		switch (mode) {
			case "fields":
			case "all":
				getIncorrectAnswers().then((questions) => {
					setAnswerData(questions);
				});
				return;
			default:
				console.error(`invalid url parameter: ${mode}`);
				notifications.show({
					color: "red",
					title: "サーバーエラー",
					message: `無効なURLパラメータです: ${mode}`,
				});
		}
	}, [mode, getIncorrectAnswers]);
	return [loading, { mode, getAnswers, getAnswerMap }];
}
