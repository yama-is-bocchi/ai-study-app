import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./lib/styles/css/index.css";
import App from "./App.tsx";

// biome-ignore lint/style/noNonNullAssertion: <>
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
