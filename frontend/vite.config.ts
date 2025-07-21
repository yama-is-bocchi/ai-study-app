import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api": "http://127.0.0.1:8080",
		},
	},
	build: {
		chunkSizeWarningLimit: 1536,
		rollupOptions: {
			output: {
				manualChunks: {
					react: ["react", "react-dom"],
					mantine: ["@mantine/core", "@mantine/hooks"],
					icons: ["@tabler/icons-react"],
					markdown: ["@uiw/react-md-editor"],
				},
			},
		},
	},
});
