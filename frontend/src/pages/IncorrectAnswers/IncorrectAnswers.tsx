import { Loader } from "@mantine/core";
import { IncorrectAnswerCard } from "../../lib/components/IncorrectAnswerCard";
import { useAnswerCollector } from "../../lib/hooks/useAnswerCollector";
import { useQuestionAPI } from "../../lib/hooks/useQuestionAPI";

export function IncorrectAnswers() {
	const [loading, { mode, getAnswers, getAnswerMap }] =
		useAnswerCollector("mode");
	const [_, { getCommentary }] = useQuestionAPI();
	return (
		<>
			{mode && !loading ? (
				mode === "all" ? (
					// TODO: 回答一覧
					getAnswers().map((question, index) => (
						<IncorrectAnswerCard
							key={question.question + index.toString()}
							question={question}
							getCommentBehavior={getCommentary}
						/>
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
