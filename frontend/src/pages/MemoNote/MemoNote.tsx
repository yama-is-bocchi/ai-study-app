import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";

export function MemoNote() {
	const [value, setValue] = useState<string | undefined>("**Hello Markdown!**");
	return (
		<>
			<MDEditor.Markdown source={value} style={{ textAlign: "left" }} />
		</>
	);
}
