import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AIMode } from "../../../pages/AIMode";
import { Home } from "../../../pages/Home";
import { IncorrectAnswers } from "../../../pages/IncorrectAnswers";
import { NormalMode } from "../../../pages/NormalMode";
import { Layout } from "../Layout";

export function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="ai" element={<AIMode />} />
					<Route path="normal" element={<NormalMode />} />
					<Route path="incorrect" element={<IncorrectAnswers />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
