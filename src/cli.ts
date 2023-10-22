import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname } from "path";
import { ArgumentUsage, compile, compileToJson } from "./compiler.js";

export async function cli(input: string, output: string, types: boolean) {
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
  const result = types
    ? generateTypes(json)
    : JSON.stringify(replaceStringsInFile(json, compileToJson));
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, result);
  console.log(`Wrote ${output}`);
};

if (process.env.NODE_ENV !== "test") {
  const args = process.argv.slice(2).filter((arg) => !arg.startsWith("-"));
  const flags = process.argv.slice(2).filter((arg) => arg.startsWith("-"));
  cli(args[0], args[1], flags.includes("--types"));
}

/**
 * Replaces all strings in a file with the result of a replacer function
 */
function replaceStringsInFile(
  source: unknown,
  replacer: (source: string) => any
): any {
  if (typeof source === "string") {
    return replacer(source);
  }
  if (Array.isArray(source)) {
    return source.map((item) => replaceStringsInFile(item, replacer)).join("");
  }
  if (typeof source === "object" && source !== null) {
    return Object.fromEntries(
      Object.entries(source).map(([key, value]) => [
        key,
        replaceStringsInFile(value, replacer),
      ])
    );
  }
  return source;
}

function generateTypes(source: unknown): string {
  if (typeof source !== "object" || source === null) {
    throw new Error("Invalid input");
  }
  const typeMap = new Map<string, Record<string, string>>();
  const typeMapping: Record<ArgumentUsage, string> = {
    argument: "TArgumentType",
    tag: "TArgumentTagType",
    time: "Date | number | string",
    date: "Date | number | string",
    plural: "number",
    select: "number | string"
  }; 
  const recurse = (source: unknown, path?: string) => {
    if (typeof source === "string" && path !== undefined) {
      const keyArgumentsFromMap = typeMap.get(path);
      const keyArguments = keyArgumentsFromMap || {};
      if (!keyArgumentsFromMap) {
        typeMap.set(path, keyArguments);
      }
      const compiled = compile(source);
      Object.entries(compiled.args).forEach(([arg, argType]) => {
        keyArguments[arg] = typeMapping[argType];
      })
    } else if (Array.isArray(source)) {
      source.forEach((item, index) => recurse(item));
    } else if (typeof source === "object" && source !== null) {
      Object.entries(source).forEach(([key, value]) => recurse(value, key));
    }
  };
  recurse(source);
  return `export type MessageArguments<TArgumentType = number | string, TArgumentTagType = (children: TArgumentType) => TArgumentType> = {\n  ${[...typeMap.entries()]
        .sort()
        .map(([key, args]) => {
            return `${JSON.stringify(key)}: {\n    ${[...Object.keys(args)].sort().map((argument) => {
                return `${JSON.stringify(argument)}: ${args[argument]};`;
            }).join("\n    ")}\n  }`;
        }).join(",\n  ")}\n};`;
}
