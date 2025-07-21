import { notifications } from "@mantine/notifications";
import { useCallback, useState } from "react";
import { getMemoDataList } from "../../api/storage";
import type { MemoData } from "../../models/memo";

export function useServerStorage() {
	const [loading, setLoading] = useState(false);
	const getMemoList = useCallback((): Promise<MemoData[]> => {
		setLoading(true);
		return getMemoDataList()
			.then((data) => {
				const now = new Date().toISOString().slice(0, 10);
				return data.length > 0 && data[0].name !== now
					? [{ name: now, data: "" }, ...data]
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
	return [loading, { getMemoList }] as const;
}
