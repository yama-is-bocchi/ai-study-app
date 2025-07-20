type YesManReducerState = {
	displayedMessages: string[];
	currentLine: number;
	charIndex: number;
};

type YesManAction =
	| { type: "SET_DISPLAYED_MESSAGES"; payload: string[] }
	| { type: "INCREMENT_CURRENT_LINE" }
	| { type: "SET_CHAR_INDEX"; payload: number };

export function yesManReducer(
	state: YesManReducerState,
	action: YesManAction,
): YesManReducerState {
	switch (action.type) {
		case "SET_DISPLAYED_MESSAGES":
			return { ...state, displayedMessages: action.payload };
		case "INCREMENT_CURRENT_LINE":
			return { ...state, currentLine: state.currentLine + 1 };
		case "SET_CHAR_INDEX":
			return { ...state, charIndex: action.payload };
		default:
			return state;
	}
}
