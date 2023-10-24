import { defineConfig } from "vitest/config";
import { resolve } from "path";
import manifest from "./package.json";

export default defineConfig(
    {
        resolve: {
            alias: [{ find: manifest.name, replacement: resolve(__dirname, "./src/runtime.ts") }]
        }
    }
);