import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../../../pages/Home";
import AIMode from "../../../pages/modes/AIMode";
import { Layout } from "../Layout";

export function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="ai" element={<AIMode />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
