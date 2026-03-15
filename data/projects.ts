export type Project = {
	name: string;
	description: string;
	tags: string[];
	image: string;
	liveUsers: string;
	stars: string;
	buildStatus: "active" | "stable";
};

export const projects: Project[] = [
	{
		name: "Mic Camera Stories",
		description: "A platform for sharing personal stories with media-rich storytelling flows.",
		tags: ["React", "TypeScript", "Content Platform"],
		image: "/miccamerastories.png",
		liveUsers: "2.4K",
		stars: "128",
		buildStatus: "active",
	},
	{
		name: "Consumer Compass",
		description: "A technology gadget review platform focused on trust, comparison, and clarity.",
		tags: ["Web", "Product Reviews", "UX"],
		image: "/consumercompass.png",
		liveUsers: "1.6K",
		stars: "94",
		buildStatus: "stable",
	},
	{
		name: "Cerebral Enigma",
		description: "A long-form blog exploring technology, social issues, and psychology.",
		tags: ["Blog", "Editorial", "Insights"],
		image: "/celebralenigma.png",
		liveUsers: "900",
		stars: "67",
		buildStatus: "active",
	},
	{
		name: "Wordle",
		description: "A simple word-guessing game where players have to guess a 5-letter word in 6 attempts.",
		tags: ["React", "JavaScript", "HTML/CSS"],
		image: "/wordle.png",
		liveUsers: "1.1K",
		stars: "86",
		buildStatus: "active",
	},
	{
		name: "Quantum Computing Group Site",
		description: "The Landing Page for QCG Club IIT Roorkee. A simple landing page to showcase the club and its activities.",
		tags: ["JavaScript", "HTML/CSS", "Tailwind CSS"],
		image: "/QCG-site.png",
		liveUsers: "780",
		stars: "59",
		buildStatus: "stable",
	},
];

