import { Button, Card, type CardProps, Text } from "@mantine/core";
import { IconCancel, IconUpload } from "@tabler/icons-react";
import MDEditor from "@uiw/react-md-editor";
import { useReducer } from "react";
import type { MemoData } from "../../models/memo";
import { memoCardReducer } from "./memoCardReducer";

interface MemoCardProps extends CardProps {
	memo: MemoData;
	uploadFileBehavior: () => Promise<void>;
}

export function MemoCard({
	memo,
	uploadFileBehavior,
	...props
}: MemoCardProps) {
	const [state, dispatch] = useReducer(memoCardReducer, {
		memo: memo.data,
		isOpenEditor: false,
	});
	return (
		<Card
			style={{
				border: "1px solid black",
				textAlign: "left",
				padding: "15px",
				margin: "10px",
			}}
			{...props}
			onDoubleClick={() => {
				if (state.isOpenEditor) return;
				dispatch({ type: "TOGGLE_OPEN_EDITOR" });
			}}
		>
			<Text>{memo.name}</Text>
			<Button
				style={{
					position: "absolute",
					top: "2px",
					right: "14px",
					display: state.isOpenEditor ? "block" : "none",
				}}
				color="secondary"
				rightSection={<IconCancel size={20} />}
				onClick={() => {
					dispatch({ type: "TOGGLE_OPEN_EDITOR" });
					dispatch({ type: "SET_MEMO", payload: state.undoMemo });
				}}
			>
				キャンセル
			</Button>
			<MDEditor.Markdown
				source={state.memo}
				style={{
					padding: "15px",
					border: "1px solid black",
				}}
			/>
			<MDEditor
				preview="edit"
				style={{ display: state.isOpenEditor ? "block" : "none" }}
				value={state.memo}
				onChange={(value) => {
					dispatch({ type: "SET_MEMO", payload: value });
				}}
			/>
			<Button
				style={{
					marginTop: "10px",
					display: state.isOpenEditor ? "block" : "none",
				}}
				onClick={() => {
					dispatch({ type: "UPDATE_UNDO_MEMO" });
					dispatch({ type: "TOGGLE_OPEN_EDITOR" });
					// TODO: アップロード
				}}
				rightSection={<IconUpload size={20} />}
			>
				保存
			</Button>
		</Card>
	);
}
