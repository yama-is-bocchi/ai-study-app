import { Box } from "@mantine/core";
import { YesMan } from "../../lib/components/YesMan";

export default function Home() {
	return (
		<div>
			<Box
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					backgroundColor: "white",
				}}
			></Box>
			<YesMan
				state="normal"
				messages={[
					"ボクは君の頼れるお手伝いロボットさっ！",
					"上のタブから使いたいモードをポチッと選んでくれると、とっても嬉しいな～！",
				]}
			/>
		</div>
	);
}
