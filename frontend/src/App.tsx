import "./App.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { AppRouter } from "./lib/routes/AppRouter";

function App() {
	return (
		<MantineProvider
			theme={{
				colorScheme: "dark",
				primaryColor: "teal",
				fontFamily: "Verdana, sans-serif",
				headings: { fontFamily: "Georgia, serif" },
			}}
		>
			<Notifications />
			<AppRouter />
		</MantineProvider>
	);
}

export default App;
