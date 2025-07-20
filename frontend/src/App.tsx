import "./lib/styles/css/App.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { AppRouter } from "./lib/routes/AppRouter";
import { tealTheme } from "./lib/styles/themes/tealTheme";

function App() {
	return (
		<MantineProvider theme={tealTheme}>
			<Notifications />
			<AppRouter />
		</MantineProvider>
	);
}

export default App;
