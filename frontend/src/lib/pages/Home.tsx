import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";

export default function Home() {
	return (
		<Button
			onClick={() =>
				notifications.show({
					title: "Default notification",
				})
			}
		>
			Show notification
		</Button>
	);
}
