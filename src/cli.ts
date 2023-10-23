import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname } from "path";
import { ArgumentUsage, compile, compileToJson } from "./compiler.js";
import yargs from "yargs-parser";

const availableLanguages = [
    "af",
    "am",
    "an",
    "ar",
    "as",
    "ast",
    "az",
    "bal",
    "be",
    "bg",
    "bn",
    "bs",
    "ca",
    "ce",
    "cs",
    "cy",
    "da",
    "de",
    "dsb",
    "el",
    "en",
    "es",
    "et",
    "eu",
    "fa",
    "fi",
    "fil",
    "fr",
    "fy",
    "ga",
    "gd",
    "gl",
    "gsw",
    "gu",
    "he",
    "hi",
    "hr",
    "hsb",
    "hu",
    "hy",
    "ia",
    "id",
    "is",
    "it",
    "ja",
    "ka",
    "kk",
    "km",
    "kn",
    "ko",
    "kw",
    "ky",
    "lij",
    "lo",
    "lt",
    "lv",
    "mk",
    "ml",
    "mn",
    "mo",
    "mr",
    "ms",
    "my",
    "nb",
    "ne",
    "nl",
    "no",
    "or",
    "pa",
    "pl",
    "prg",
    "ps",
    "pt",
    "ro",
    "ru",
    "sc",
    "scn",
    "sd",
    "sh",
    "si",
    "sk",
    "sl",
    "sq",
    "sr",
    "sv",
    "sw",
    "ta",
    "te",
    "th",
    "tk",
    "tl",
    "tpi",
    "tr",
    "uk",
    "und",
    "ur",
    "uz",
    "vec",
    "vi",
    "yue",
    "zh",
    "zu",
  ];

export async function cli(input: string, output: string, types: boolean, languages: string[] = availableLanguages) {
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
    ? generateTypes(json, languages)
    : JSON.stringify(replaceStringsInFile(json, compileToJson));
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, result);
  console.log(`Wrote ${output}`);
}


if (String(process.argv[1]).match(/(icu-to-json|cli)\.(js|ts)$/)) {
  const argv = yargs(process.argv.slice(2), {
    boolean: ["types"],
    array: ["lang"]
  });
  const langArg = (argv.lang as string[]).join(",").split(",").filter(Boolean).filter((lang) => availableLanguages.includes(lang.split("-")[0]));
  const lang = langArg.length ? langArg : availableLanguages;
  cli(argv[0], argv[1], argv.types, lang);
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

function generateTypes(source: unknown, languages: string[]): string {
  if (typeof source !== "object" || source === null) {
    throw new Error("Invalid input");
  }
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
  const recurse = (source: unknown, path?: string) => {
    if (typeof source === "string" && path !== undefined) {
      const keyArgumentsFromMap = typeMap.get(path);
      const keyArguments = keyArgumentsFromMap || {};
      if (!keyArgumentsFromMap) {
        typeMap.set(path, keyArguments);
      }
      const compiled = compile(source);
      Object.entries(compiled.args).forEach(([arg, argType]) => {
        keyArguments[arg] =
          typeMapping[
            argType.filter((usage) => usage !== "argument")[0] || "argument"
          ];
        argType.forEach((usage) => usages.add(usage));
      });
    } else if (Array.isArray(source)) {
      source.forEach((item, index) => recurse(item));
    } else if (typeof source === "object" && source !== null) {
      Object.entries(source).forEach(([key, value]) => recurse(value, key));
    }
  };

  recurse(source);

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

  const imports = [`import type { Locale } from "icu-to-json";`];

  if (Object.keys(messageFormatFormatters).length) {
    imports.push(
      `import { ${Object.values(messageFormatFormatters).join(
        ", "
      )} } from "@messageformat/runtime/lib/formatters";`
    );
  }

  const formatters = `export const formatters = { ${Object.keys(
    messageFormatFormatters
  ).join(", ")} };`;

  const types = `export type MessageArguments<TArgumentType = number | string, TArgumentTagType = (children: TArgumentType) => TArgumentType> = {\n  ${[
    ...typeMap.entries(),
  ]
    .sort()
    .map(([key, args]) => {
      const keyArguments = Object.keys(args).sort();
      if (!keyArguments.length) {
        return `${JSON.stringify(key)}?: never | Record<string, never>`;
      }
      return `${JSON.stringify(key)}: {\n    ${
        keyArguments.map((argument) => {
          return `${JSON.stringify(argument)}: ${args[argument]};`;
        })
        .join("\n    ")}\n  }`;
    })
    .join(",\n  ")}\n};`;

  const pluralImports = languages.map(
    (language) => language + " as " + language + "Plural"
  );
  const ordinalImports = languages.map(
    (language) => language + " as " + language + "Ordinal"
  );

  if (usages.has("plural")) {
    imports.push(
      `import { ${pluralImports.join(", ")} } from "make-plural/plurals";`
    );
  }
  if (usages.has("selectordinal")) {
    imports.push(
      `import { ${ordinalImports.join(
        ", "
      )} } from "@messageformat/runtime/lib/cardinals";`
    );
  }

  const locales = languages.map((language) => {
    const lang = JSON.stringify(language);
    const plural = usages.has("plural") ? language + "Plural" : (usages.has("selectordinal") ? "null" : undefined);
    const ordinal = usages.has("selectordinal")
      ? language + "Ordinal"
      : undefined;
    const localeParts = [lang, plural, ordinal].filter(Boolean);

    return `export const ${language}: Locale = [${localeParts.join(", ")}]${localeParts.length !== 3 ? " as any" : ""};`;
  });

  return `${imports.join("\n")}\n${formatters}\n${types}\n${locales.join("\n")}`;
}
