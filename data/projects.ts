export type Project = {
	name: string;
	description: string;
	tags: string[];
	liveUsers: string;
	stars: string;
	buildStatus: "active" | "stable";
};

export const projects: Project[] = [
	{
		name: "Mic Camera Stories",
		description: "A platform for sharing personal stories with media-rich storytelling flows.",
		tags: ["React", "TypeScript", "Content Platform"],
		liveUsers: "2.4K",
		stars: "128",
		buildStatus: "active",
	},
	{
		name: "Consumer Compass",
		description: "A technology gadget review platform focused on trust, comparison, and clarity.",
		tags: ["Web", "Product Reviews", "UX"],
		liveUsers: "1.6K",
		stars: "94",
		buildStatus: "stable",
	},
	{
		name: "Cerebral Enigma",
		description: "A long-form blog exploring technology, social issues, and psychology.",
		tags: ["Blog", "Editorial", "Insights"],
		liveUsers: "900",
		stars: "67",
		buildStatus: "active",
	},
];

