import { Box } from "@mantine/core";
import { TopTab } from "./../lib/components/TopTab";

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
			>
				<TopTab />
			</Box>
		</div>
	);
}
