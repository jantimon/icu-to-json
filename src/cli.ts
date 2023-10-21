import { writeFile, readFile, mkdir } from "fs/promises";
import { dirname } from "path";
import { compileToJson } from "./compiler.js";

(async function cli (input: string, output: string){
    if (!input || !output) {
        console.error("Usage: formatjs-cli input.js output.json");
        process.exit(1);
    }
    if (input === output) {
        console.error("Input and output cannot be the same file");
        process.exit(1);
    }
    const source = await readFile(input, "utf8");
    const json = JSON.parse(source);
    const result = replaceStringsInFile(json, compileToJson);
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, JSON.stringify(result));
    console.log(`Wrote ${output}`);
})(
    process.argv[2],
    process.argv[3]
);

/**
 * Replaces all strings in a file with the result of a replacer function
 */
function replaceStringsInFile (source: unknown, replacer: (source: string) => any): any {
    if (typeof source === "string") {
        return replacer(source);
    }
    if (Array.isArray(source)) {
        return source.map((item) => replaceStringsInFile(item, replacer)).join("");
    }
    if (typeof source === "object" && source !== null) {
        return Object.fromEntries(
            Object.entries(source).map(([key, value]) => [key, replaceStringsInFile(value, replacer)])
        );
    }
    return source;
}