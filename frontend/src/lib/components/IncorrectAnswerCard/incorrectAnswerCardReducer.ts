type IncorrectAnswerCardState = {
	loading: boolean;
	isHovered: boolean;
	isOpenComment: boolean;
	comment: string | undefined;
};

type IncorrectAnswerCardAction =
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_HOVERED"; payload: boolean }
	| { type: "TOGGLE_IS_OPEN_COMMENT"; payload: boolean }
	| { type: "SET_COMMENT"; payload: string | undefined };

export function incorrectAnswerCardReducer(
	state: IncorrectAnswerCardState,
	action: IncorrectAnswerCardAction,
): IncorrectAnswerCardState {
	switch (action.type) {
		case "SET_LOADING":
			return { ...state, loading: action.payload };
		case "SET_HOVERED":
			return { ...state, isHovered: action.payload };
		case "TOGGLE_IS_OPEN_COMMENT":
			return { ...state, isOpenComment: !state.isOpenComment };
		case "SET_COMMENT":
			return { ...state, comment: action.payload };
		default:
			return state;
	}
}
