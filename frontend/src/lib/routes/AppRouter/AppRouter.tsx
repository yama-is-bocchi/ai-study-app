import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "../../../pages/Home";
import { IncorrectAnswers } from "../../../pages/IncorrectAnswers";
import { MemoNote } from "../../../pages/MemoNote";
import { QuestionMode } from "../../../pages/QuestionMode";
import { Layout } from "../Layout";

export function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="ai" element={<QuestionMode key="ai" mode="ai" />} />
					<Route
						path="normal"
						element={<QuestionMode key="random" mode="random" />}
					/>
					<Route path="incorrect" element={<IncorrectAnswers />} />
					<Route path="memo" element={<MemoNote />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
