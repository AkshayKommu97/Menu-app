/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      global: "global", // Use 'global' directly as a string
    },
  },
  define: {
    global: "globalThis", // Define the global object
  },
  build: {
    outDir: "build", // Specify the output directory
  },
});
