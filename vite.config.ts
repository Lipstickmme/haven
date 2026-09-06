import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // Vercel's build output API. Nitro's Vite plugin reads this top-level key.
  nitro: { preset: "vercel" },
  resolve: {
    // One copy of React across the app, Radix and TanStack.
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-store"],
  },
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    // Redirect Start's bundled server entry to src/server.ts, which owns the
    // /api/* table and the SSR error wrapper.
    tanstackStart({ server: { entry: "server" } }),
    nitro(),
    viteReact(),
  ],
});
