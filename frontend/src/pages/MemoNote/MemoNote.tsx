import { Loader } from "@mantine/core";
import MDEditor from "@uiw/react-md-editor";
import { useCallback, useEffect, useState } from "react";
import { useServerStorage } from "../../lib/hooks/useServerStorage";
import type { MemoListData } from "../../lib/models/memo";
export function MemoNote() {
	const [loading, { getMemoList }] = useServerStorage();
	const [memoList, setMemoList] = useState<MemoListData[] | undefined>(
		undefined,
	);
	const refreshMemoList = useCallback(() => {
		getMemoList().then((memo) => {
			setMemoList(memo);
		});
	}, [getMemoList]);
	useEffect(() => {
		refreshMemoList();
	}, [refreshMemoList]);
	if (loading) return <Loader />;
	return (
		<>
			{memoList
				? memoList.map((memo) => (
						<>
							<MDEditor.Markdown
								source={memo.name}
								style={{ textAlign: "left" }}
							/>
						</>
					))
				: undefined}
		</>
	);
}
