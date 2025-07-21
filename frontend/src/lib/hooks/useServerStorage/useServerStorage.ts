import { useCallback, useState } from "react";
import { getMemoListData } from "../../api/storage";
import type { MemoListData } from "../../models/memo";

export function useServerStorage() {
	const [loading, setLoading] = useState(false);
	const getMemoList = useCallback((): Promise<MemoListData[]> => {
		setLoading(true);
		return getMemoListData()
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
