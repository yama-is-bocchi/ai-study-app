import type { KyResponse } from "ky";
import ky from "ky";
import type { Question } from "../../models/question";
import { TIMEOUT_INTERVAL } from "../const";

export function getCommentaryFromQuestion(
	question: Question,
): Promise<KyResponse> {
	return ky.post("/api/v1/question/commentary", {
		json: question,
		timeout: TIMEOUT_INTERVAL,
	});
}

export function getQuestions(
	mode: "ai" | "random" | "incorrect",
): Promise<KyResponse> {
	return ky.get("/api/v1/question", {
		searchParams: { mode },
		timeout: TIMEOUT_INTERVAL,
	});
}

export function postAnswer(
	question: Question,
	isCorrect: boolean,
): Promise<KyResponse> {
	return ky.post("/api/v1/question/answer", {
		json: {
			...question,
			correct: isCorrect,
		},
		timeout: TIMEOUT_INTERVAL,
	});
}
