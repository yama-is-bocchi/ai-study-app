type MemoCardState = {
	memo: string;
	undoMemo: string;
	isOpenEditor: boolean;
};

type MemoCardAction =
	| { type: "SET_MEMO"; payload: string }
	| { type: "UPDATE_UNDO_MEMO" }
	| { type: "TOGGLE_OPEN_EDITOR" };

export function memoCardReducer(
	state: MemoCardState,
	action: MemoCardAction,
): MemoCardState {
	switch (action.type) {
		case "SET_MEMO":
			return { ...state, memo: action.payload };
		case "UPDATE_UNDO_MEMO":
			return { ...state, undoMemo: state.memo };
		case "TOGGLE_OPEN_EDITOR":
			return { ...state, isOpenEditor: !state.isOpenEditor };
		default:
			return state;
	}
}
