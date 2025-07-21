import { Card, type CardProps, Text } from "@mantine/core";
import MDEditor from "@uiw/react-md-editor";
import type { MemoData } from "../../models/memo";

interface MemoCardProps extends CardProps {
	memo: MemoData;
	uploadFileBehavior: () => Promise<void>;
}

export function MemoCard({
	memo,
	uploadFileBehavior,
	...props
}: MemoCardProps) {
	return (
		<Card {...props}>
			<Text>{memo.name}</Text>
			<MDEditor.Markdown
				source={memo.data}
				style={{ textAlign: "left", padding: "10px" }} // TODO: 編集ボタン
			/>
		</Card>
	);
}
