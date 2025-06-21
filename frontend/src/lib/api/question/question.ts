import type { KyResponse } from "ky";
import ky from "ky";
import { TIMEOUT_INTERVAL } from "../const";

export function getQuestions(
	mode: "ai" | "random" | "incorrect",
): Promise<KyResponse> {
	return ky.get("/api/v1/question", {
		searchParams: { mode },
		timeout: TIMEOUT_INTERVAL,
	});
}
