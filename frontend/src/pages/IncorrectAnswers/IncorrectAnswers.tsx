import { Loader } from "@mantine/core";
import { IncorrectAnswerCard } from "../../lib/components/IncorrectAnswerCard";
import { QuestionFieldList } from "../../lib/components/QuestionFieldList";
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
					getAnswers().map((question, index) => (
						<IncorrectAnswerCard
							key={question.question + index.toString()}
							question={question}
							getCommentBehavior={getCommentary}
						/>
					))
				) : (
					// TODO: 分野別一覧
					[...getAnswerMap().entries()].map(([field, questions]) => (
						<div
							key={field}
							style={{ minWidth: "1000px", padding: "5px", marginTop: "10px" }}
						>
							<QuestionFieldList
								fieldName={field}
								getCommentBehavior={getCommentary}
								questionChildren={questions}
							/>
						</div>
					))
				)
			) : (
				<Loader />
			)}
		</>
	);
}
