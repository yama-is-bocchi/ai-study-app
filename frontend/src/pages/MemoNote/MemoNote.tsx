import { Loader } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { MemoCard } from "../../lib/components/MemoCard";
import { useServerStorage } from "../../lib/hooks/useServerStorage";
import type { MemoData } from "../../lib/models/memo";
export function MemoNote() {
	const [loading, { getMemoList, uploadFile }] = useServerStorage();
	const [memoList, setMemoList] = useState<MemoData[] | undefined>(undefined);
	const refreshMemoList = useCallback(() => {
		getMemoList().then((memo) => {
			setMemoList(memo);
		});
	}, [getMemoList]);
	useEffect(() => {
		refreshMemoList();
	}, [refreshMemoList]);
	if (memoList === undefined && loading) return <Loader />;
	return (
		<div style={{ marginTop: "20px" }}>
			{memoList
				? memoList.map((memo) => (
						<>
							<MemoCard
								memo={memo}
								uploadFileBehavior={(content) =>
									uploadFile(`${memo.name}.md`, content, "text/plain")
								}
							/>
						</>
					))
				: undefined}
		</div>
	);
}
