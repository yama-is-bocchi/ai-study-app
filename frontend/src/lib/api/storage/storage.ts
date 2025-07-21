import type { MemoListData } from "../../models/memo";
import { kyClient } from "../kyClient/kyClient";

export function getMemoListData(): Promise<MemoListData[]> {
	return kyClient
		.get("/api/v1/files/memo")
		.then((response) => response.json<MemoListData[]>());
}
