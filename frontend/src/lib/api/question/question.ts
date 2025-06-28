import type { KyResponse } from "ky";
import ky from "ky";
import type { Question } from "../../models/question";
import { TIMEOUT_INTERVAL } from "../const";

export function getQuestions(
	mode: "ai" | "random" | "incorrect",
): Promise<KyResponse> {
	return ky.get("/api/v1/question", {
		searchParams: { mode },
		timeout: TIMEOUT_INTERVAL,
	});
}

export function postAnswer(question: Question): Promise<KyResponse> {
	return ky.post("/api/v1/question", {
		json: question,
		timeout: TIMEOUT_INTERVAL,
	});
}
