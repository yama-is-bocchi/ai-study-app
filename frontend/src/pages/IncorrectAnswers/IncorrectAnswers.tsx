import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function IncorrectAnswers() {
	const [searchParams] = useSearchParams();
	const mode = searchParams.get("mode");
	useEffect(() => {
		console.log(mode);
	}, [mode]);
	return (
		<div>
			<h1>Mode: {mode}</h1>
		</div>
	);
}
