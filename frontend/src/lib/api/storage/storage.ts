import type { MemoData } from "../../models/memo";
import { kyClient } from "../kyClient/kyClient";

export function getMemoDataList(): Promise<MemoData[]> {
	return kyClient
		.get("/api/v1/files/memo")
		.then((response) => response.json<MemoData[]>());
}

export function uploadFileContent(
	fileName: string,
	content: Blob | string,
	contentType: string,
): Promise<void> {
	return kyClient.put(`/api/v1/files/${fileName}`, {
		headers: {
			"Content-Type": contentType,
		},
		body: content,
	});
}
