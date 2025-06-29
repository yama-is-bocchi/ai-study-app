export type Question = {
	field_name: string;
	question: string;
	answer: string;
};

export type OutputQuestion = {
	question: Question;
	dummy_answers: string[];
};
