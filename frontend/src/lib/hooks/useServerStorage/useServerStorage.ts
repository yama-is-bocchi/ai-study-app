import { notifications } from "@mantine/notifications";
import { useCallback, useState } from "react";
import { getMemoDataList, uploadFileContent } from "../../api/storage";
import type { MemoData } from "../../models/memo";

export function useServerStorage() {
	const [loading, setLoading] = useState(false);
	const getMemoList = useCallback((): Promise<MemoData[]> => {
		setLoading(true);
		return getMemoDataList()
			.then((data) => {
				const now = new Date().toISOString().slice(0, 10);
				const nowData = { name: now, data: "" };
				if (data.length === 0) return [nowData];
				return data.length > 0 && data[0].name !== now
					? [nowData, ...data]
					: data;
			})
			.catch((error) => {
				notifications.show({
					color: "red",
					title: "サーバーエラー",
					message: `メモリストの取得に失敗しました: ${error}`,
				});
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const uploadFile = useCallback(
		(
			fileName: string,
			content: Blob | string,
			contentType: string,
		): Promise<void> => {
			setLoading(true);
			return uploadFileContent(fileName, content, contentType)
				.catch((error) => {
					notifications.show({
						color: "red",
						title: "サーバーエラー",
						message: `ファイルのアップロードに失敗しました: ${error}`,
					});
				})
				.finally(() => {
					setLoading(false);
				});
		},
		[],
	);

	return [loading, { getMemoList, uploadFile }] as const;
}
