import type { OutputtedQuestion, Question } from "../../lib/models/question";

type QuestionModeState = {
	outputtedQuestion: OutputtedQuestion | undefined;
	answeredQuestionData:
		| {
				answered: boolean;
				question: Question;
		  }
		| undefined;
	selectedAnswer: string;
};

type QuestionModeAction =
	| { type: "SET_OUTPUTTED_QUESTION"; payload: OutputtedQuestion | undefined }
	| {
			type: "SET_ANSWERED_QUESTION_DATA";
			payload:
				| {
						answered: boolean;
						question: Question;
				  }
				| undefined;
	  }
	| { type: "SET_SELECTED_ANSWER"; payload: string };

export function questionModeReducer(
	state: QuestionModeState,
	action: QuestionModeAction,
): QuestionModeState {
	switch (action.type) {
		case "SET_OUTPUTTED_QUESTION":
			return { ...state, outputtedQuestion: action.payload };
		case "SET_ANSWERED_QUESTION_DATA":
			return { ...state, answeredQuestionData: action.payload };
		case "SET_SELECTED_ANSWER":
			return { ...state, selectedAnswer: action.payload };
	}
}
