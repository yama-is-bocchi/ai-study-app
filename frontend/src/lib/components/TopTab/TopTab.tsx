import { Tabs } from "@mantine/core";
import {
	IconBubbleText,
	IconChevronCompactRight,
	IconChevronCompactUp,
	IconLibrary,
	IconPencilX,
	IconRobot,
} from "@tabler/icons-react";
import { useState } from "react";

export function TopTab() {
	const [tabsVisible, setTabsVisible] = useState(true);

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
				>
					AI Mode
				</Tabs.Tab>
				<Tabs.Tab
					value="Normal Mode"
					style={{ display: tabsVisible ? "" : "none" }}
					leftSection={<IconLibrary size={24} />}
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
				>
					Incorrect Answers
				</Tabs.Tab>
				<Tabs.Tab
					value="Toggle"
					leftSection={
						tabsVisible ? (
							<IconChevronCompactUp size={24} />
						) : (
							<IconChevronCompactRight size={14} />
						)
					}
					onClick={() => setTabsVisible((prev) => !prev)}
				/>
			</Tabs.List>
		</Tabs>
	);
}
