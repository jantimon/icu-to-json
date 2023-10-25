import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname } from "path";
import { ArgumentUsage, compile, compileToJson } from "./compiler.js";
import { availableLanguages } from "./messageformat/languages.js";
import yargs from "yargs-parser";

type Options = Partial<{
  languages: string[],
  formatters: boolean,
}>

export async function cli(input: string, output: string, types: boolean, normalizeJson?: boolean, options: Options = {}) {
  if (!input || !output) {
    console.error("Usage: icu-to-json input.js output.json");
    process.exit(1);
  }
  if (input === output) {
    console.error("Input and output cannot be the same file");
    process.exit(1);
  }
  const source = await readFile(input, "utf8");
  const json = JSON.parse(source);
  const result = types
    ? generateDictionaryApi(json, options)
    : JSON.stringify(replaceStringsInFile(normalizeJson ? normalize(json) : json, compileToJson));

  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, result);
  console.log(`Wrote ${output}`);
}


if (String(process.argv[1]).match(/(icu-to-json|cli)(\.(js|ts|cmd)|)$/)) {
  const argv = yargs(process.argv.slice(2), {
    boolean: ["types", "formatters", "normalize"],
    array: ["lang"]
  });
  const langArg = (argv.lang as string[]).join(",").split(",").filter(Boolean).filter((lang) => availableLanguages.includes(lang.split("-")[0]));
  const languages = langArg.length ? langArg : availableLanguages;
  cli(argv[0], argv[1], argv.types, argv.normalize,{ languages, formatters: argv.formatters });
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

function generateDictionaryApi(source: unknown, options: Options = {}): string {
  const dictionary = normalize(source);
  const usages = new Set<ArgumentUsage>();
  const typeMap = new Map<string, Record<string, string>>();
  const typeMapping: Record<ArgumentUsage, string> = {
    argument: "TArgumentType",
    tag: "TArgumentTagType",
    time: "Date | number | string",
    date: "Date | number | string",
    plural: "number",
    selectordinal: "number",
    number: "number",
    numberFmt: "number",
    select: "number | string",
  };

  Object.values(dictionary).forEach((keyWord) => {
    Object.entries(keyWord).forEach(([translationKey, translation]) => {
      const compiled = compile(translation);
      const typeMapForTranslation = typeMap.get(translationKey);
      const typeMapForTranslationArgs = typeMapForTranslation || {};
      if (!typeMapForTranslation) {
        typeMap.set(translationKey, typeMapForTranslationArgs);
      }
      Object.entries(compiled.args).forEach(([arg, argType]) => {
        typeMapForTranslationArgs[arg] =  typeMapping[
          argType.filter((usage) => usage !== "argument")[0] || "argument"
          ]
        argType.forEach((usage) => usages.add(usage));
      });
    });
  });

  const usedLanguages = Object.keys(dictionary);
  const languageWithRegions = (options.languages || usedLanguages || availableLanguages).sort();
  const withFormatters = options.formatters !== false;

  const imports: string[] = [];
  const code: string[] = [];

  if (withFormatters) {
    const messageFormatFormatters: Record<string, string> = {};
    if (usages.has("date")) {
      messageFormatFormatters["date"] = "date";
    }
    if (usages.has("time")) {
      messageFormatFormatters["time"] = "time";
    }
    if (usages.has("number")) {
      messageFormatFormatters["numberFmt"] = "numberFmt";
    }
    if (Object.keys(messageFormatFormatters).length) {
      imports.push(
        `import { ${Object.values(messageFormatFormatters).join(
          ", "
        )} } from "@messageformat/runtime/lib/formatters";`
      );
    }
    code.push(`export const formatters = { ${Object.keys(
      messageFormatFormatters
    ).join(", ")} };`
    );
  }

  // MessageArguments Type
  code.push(`export type MessageArguments<TArgumentType = number | string, TArgumentTagType = (children: TArgumentType) => TArgumentType> = {\n  ${[
    ...typeMap.entries(),
  ]
    .sort()
    .map(([key, args]) => {
      const keyArguments = Object.keys(args).sort();
      if (!keyArguments.length) {
        return `${JSON.stringify(key)}?: never | Record<string, never>`;
      }
      return `${JSON.stringify(key)}: {\n    ${keyArguments.map((argument) => {
        return `${JSON.stringify(argument)}: ${args[argument]};`;
      })
        .join("\n    ")}\n  }`;
    })
    .join(",\n  ")}\n};`);

  // Language type
  code.push(`export type Language = ${languageWithRegions.map((lang) => JSON.stringify(lang)).join(" | ")};`);

  // t function
  code.push("\n");
  imports.push(`import { type CompiledAst, evaluateAst, run } from "icu-to-json";`);
  code.push(`/**
  * This function is used to create a translation function that returns a string
  */`,
    `export const createTranslationFn = (messages: Record<string, unknown>, lang: Language) => 
  <TKey extends keyof MessageArguments>(key: TKey, args: MessageArguments[TKey]): string => run(messages[key] as CompiledAst, lang, args as Record<string, string | number | Date>, formatters);`
  );
  code.push(
    `/**
  * This function is used to create a translation function that returns a rich AST
  */`,
    `export const createTranslationRitchFn = (messages: Record<string, unknown>, lang: Language, childPreprocessor?: (children: unknown) => any) => {
  const richFormatters = {...formatters, children: childPreprocessor}${/* TODO - fix formatter typings */" as any"};
  return <TKey extends keyof MessageArguments>(key: TKey, args: MessageArguments[TKey]) => evaluateAst(messages[key] as CompiledAst, lang, args as Record<string, string | number | Date>, richFormatters);
};`
  );

  return `${imports.join("\n")}\n${code.join("\n")}`;
}

/**
 * Normalize JSON structure to { "en-UK": { "translationKey": "icu text" } } format
 * 
 * Supported formats:
 * - `{ en: { ... }, "en-UK": { ... } }`
 * - `{ wordA: { en: { ... }, "en-UK": { ... } }, wordB: { en: { ... }, "en-UK": { ... } } }`
 * - `{ pageX: { wordA: { en: { ... }, "en-UK": { ... } }, wordB: { en: { ... }, "en-UK": { ... } } } }`
 * - `{ pageX: { { en: { ... }, "en-UK": { ... } } }`
 */
function normalize(source: unknown): Record<string, Record<string, string>> {
  if (typeof source !== "object" || source === null) {
    throw new Error(`Invalid format - supported formats: { en: { ... }, "en-UK": { ... } } or { wordA: { en: { ... }, "en-UK": { ... } }, wordB: { en: { ... }, "en-UK": { ... } } }`);
  }
  const entries = Object.entries(source);
  const firstLevel = new Set<string>();
  const secondLevel = new Set<string>();
  entries.forEach(([key, value]) => {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid format - supported formats: { en: { ... }, "en-UK": { ... } } or { wordA: { en: { ... }, "en-UK": { ... } }, wordB: { en: { ... }, "en-UK": { ... } } }`);
    }
    firstLevel.add(key);
    Object.keys(value).forEach((key) => secondLevel.add(key));
  });
  // Is it already normalized?
  const firstLevelContainsOnlyLanguages = [...firstLevel].every((key) => availableLanguages.includes(key.split("-")[0]));
  if (firstLevelContainsOnlyLanguages) {
    return source as Record<string, Record<string, string>>;
  }
  // Flip the structure - word <-> language
  const secondLevelContainsOnlyLanguages = [...secondLevel].every((key) => availableLanguages.includes(key.split("-")[0]));
  if (secondLevelContainsOnlyLanguages) {
    const result: Record<string, Record<string, string>> = {};
    entries.forEach(([key, value]) => {
      Object.entries(value).forEach(([lang, translation]) => {
        result[lang] = { ...result[lang], [key]: translation as string };
      });
    });
    return result;
  }
  // Try deeper nesting
  const result: Record<string, Record<string, string>> = {};
  entries.forEach(([key, value]) => {
    Object.entries(normalize(value)).forEach(([key, value]) => {
      result[key] = {...result[key], ...value};
    });
  });
  if (Object.keys(result).length) {
    return result;
  }
  throw new Error(`Invalid format - supported formats: { en: { ... }, "en-UK": { ... } } or { wordA: { en: { ... }, "en-UK": { ... } }, wordB: { en: { ... }, "en-UK": { ... } } }`);
}