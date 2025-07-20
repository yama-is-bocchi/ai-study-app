import { Box } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { TopTab } from "./../../components/TopTab";

export function Layout() {
	return (
		<>
			<Box
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					backgroundColor: "white",
					zIndex: 1000,
				}}
			>
				<TopTab />
			</Box>
			<Outlet />
		</>
	);
}
