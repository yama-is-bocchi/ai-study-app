import { Button, type ButtonProps } from "@mantine/core";
import { IconQuestionMark } from "@tabler/icons-react";
import { Outlet } from "react-router-dom";

interface SelectAnswerButtonProps extends ButtonProps {
	selectAnswerBehavior: () => void;
}

export function SelectAnswerButton({
	selectAnswerBehavior,
	...props
}: SelectAnswerButtonProps) {
	return (
		<Button
			rightSection={<IconQuestionMark size={24} />}
			onClick={selectAnswerBehavior}
			{...props}
			style={{
				backgroundColor: "black",
				color: "limegreen",
			}}
			styles={{
				root: {
					"&:hover": {
						backgroundColor: "#222",
						transform: "scale(1.03)",
						transition: "all 0.2s ease-in-out",
					},
				},
			}}
		>
			<Outlet />
		</Button>
	);
}
