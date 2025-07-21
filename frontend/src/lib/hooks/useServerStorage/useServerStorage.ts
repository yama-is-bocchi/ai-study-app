import { useCallback, useState } from "react";
import { getMemoDataList } from "../../api/storage";
import type { MemoData } from "../../models/memo";

export function useServerStorage() {
	const [loading, setLoading] = useState(false);
	const getMemoList = useCallback((): Promise<MemoData[]> => {
		setLoading(true);
		return getMemoDataList()
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
