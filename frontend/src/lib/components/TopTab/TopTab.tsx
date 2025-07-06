import { Box, Button, Tabs } from "@mantine/core";
import {
	IconBubbleText,
	IconChevronCompactLeft,
	IconChevronCompactRight,
	IconLibrary,
	IconPencilX,
	IconRobot,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export function TopTab() {
	const [tabsVisible, setTabsVisible] = useState(true);
	const [isIncorrect, setIsIncorrect] = useState(false);
	const navigate = useNavigate();
	const handleEnterInCorrect = useCallback(() => {
		setIsIncorrect(true);
	}, []);
	const handleLeaveInCorrect = useCallback(() => {
		setIsIncorrect(false);
	}, []);
	return (
		<Tabs
			style={{
				overflow: "hidden",
				transition: "max-height 0.3s ease",
				maxWidth: tabsVisible ? "1000px" : "70px",
			}}
			defaultValue="AI Mode"
		>
			<Tabs.List>
				<Tabs.Tab
					value="AI Mode"
					style={{ display: tabsVisible ? "" : "none" }}
					leftSection={<IconRobot size={24} />}
					onClick={() => {
						navigate("/ai");
					}}
				>
					AI Mode
				</Tabs.Tab>
				<Tabs.Tab
					value="Normal Mode"
					style={{ display: tabsVisible ? "" : "none" }}
					leftSection={<IconLibrary size={24} />}
					onClick={() => {
						navigate("/normal");
					}}
				>
					Normal Mode
				</Tabs.Tab>
				<Tabs.Tab
					value="Blog"
					style={{ display: tabsVisible ? "" : "none" }}
					leftSection={<IconBubbleText size={24} />}
				>
					Blog
				</Tabs.Tab>
				<Tabs.Tab
					value="Incorrect Answers"
					style={{ display: tabsVisible ? "" : "none" }}
					leftSection={<IconPencilX size={24} />}
					onMouseEnter={handleEnterInCorrect}
					onMouseLeave={handleLeaveInCorrect}
				>
					Incorrect Answers
				</Tabs.Tab>
				<Tabs.Tab
					value="Toggle"
					leftSection={
						tabsVisible ? (
							<IconChevronCompactLeft size={14} />
						) : (
							<IconChevronCompactRight size={14} />
						)
					}
					onClick={() => setTabsVisible((prev) => !prev)}
				/>
			</Tabs.List>
			<Box
				onMouseEnter={handleEnterInCorrect}
				onMouseLeave={handleLeaveInCorrect}
				style={{
					display: isIncorrect ? "flex" : "none",
					flexDirection: "column",
					position: "relative",
					padding: "8px",
					borderRadius: "16px",
					textAlign: "center",
					gap: "5px",
				}}
			>
				<Button
					onClick={() => {
						setIsIncorrect(false);
						navigate("/incorrect?mode=fields");
					}}
				>
					Fields
				</Button>
				<Button
					onClick={() => {
						setIsIncorrect(false);
						navigate("/incorrect?mode=all");
					}}
				>
					All
				</Button>
			</Box>
		</Tabs>
	);
}
