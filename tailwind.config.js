/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				bot: {
					bubble: "#f3f4f6",
					text: "#1f2937",
				},
				user: {
					bubble: "#3b82f6",
					text: "#ffffff",
				},
			},
		},
	},
};
