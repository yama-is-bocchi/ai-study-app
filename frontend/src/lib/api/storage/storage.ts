import type { MemoData } from "../../models/memo";
import { kyClient } from "../kyClient/kyClient";

export function getMemoDataList(): Promise<MemoData[]> {
	return kyClient
		.get("/api/v1/files/memo")
		.then((response) => response.json<MemoData[]>());
}
