import type { KyResponse } from "ky";
import type { OutputtedQuestion, Question } from "../../models/question";
import { kyClient } from "../kyClient/kyClient";

export function getCommentaryFromQuestion(question: Question): Promise<string> {
	return kyClient
		.post("/api/v1/question/commentary", {
			json: question,
		})
		.then((response) => response.json<string>());
}

export function getQuestions(
	mode: "ai" | "random" | "incorrect",
): Promise<KyResponse> {
	return kyClient
		.get("/api/v1/question", {
			searchParams: { mode },
		})
		.then((response) => response.json<OutputtedQuestion>());
}

export function postAnswer(
	question: Question,
	isCorrect: boolean,
): Promise<void> {
	return kyClient.post("/api/v1/question/answer", {
		json: {
			...question,
			correct: isCorrect,
		},
	});
}
