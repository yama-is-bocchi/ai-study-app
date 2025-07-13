import { Loader } from "@mantine/core";
import { useAnswerCollector } from "../../lib/hooks/useAnswerCollector";

export function IncorrectAnswers() {
	const [loading, { mode, getAnswers, getAnswerMap }] =
		useAnswerCollector("mode");
	return (
		<>
			{mode && !loading ? (
				mode === "all" ? (
					// TODO: 回答一覧
					getAnswers().map((question, index) => (
						<li key={question.answer}>{question.answer + index.toString()}</li>
					))
				) : (
					// TODO: 分野別一覧
					Array.from(getAnswerMap().entries()).map(([key, questions]) => (
						<li key={key}>
							{key}:{console.log(questions)}
						</li>
					))
				)
			) : (
				<Loader />
			)}
		</>
	);
}
