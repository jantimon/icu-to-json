import { number, select } from "./messageformat/runtime.js";
import { type CompiledAst, type CompiledAstContents, JSON_AST_TYPE_FN, JSON_AST_TYPE_PLURAL, JSON_AST_TYPE_SELECT, JSON_AST_TYPE_SELECTORDINAL, JSON_AST_TYPE_TAG } from "./constants.js";
export type { CompiledAst } from "./constants.js";

/**
 * Given a precompiled compiled ICU message JSON, return the evaluated string.
 * If the message contains non-string values, they will be returned as an array of strings and values.
 * 
 * This allows using the runtime with React, Vue, Svelte, etc.
 * 
 * @param packedAst - The precompiled compiled ICU message JSON.
 * @param locale - A locale e.g. "en" or "en-GB".
 * @param args - The arguments to be used in the message.
 * @param formatters - The formatters to be used in the message.
 * @returns The evaluated string or an array of strings and values.
 */
export const evaluateAst = <T, U>(
  packedAst: CompiledAst,
  locale: string,
  args: Record<string, T>,
  formatters?: Record<string, (...args: any[]) => U>
) => {
  // pure text can be returned as string:
  if (typeof packedAst === "string") {
    return [packedAst];
  }
  const withDefaultFormatters = {
    number: (value: number, lc: string) => number(lc, value, 0),
    ...formatters,
  };
  // unpack the AST:
  const [argNames, ...ast] = packedAst;
  const result = reduceStrings(ast
    .map((contents) =>
      getContentValues(contents, argNames, args, locale, 0, withDefaultFormatters)
    )
    .flat());
  return result;
};

/**
 * Given a precompiled compiled ICU message JSON, return the evaluated string.
 * 
 * @param packedAst - The precompiled compiled ICU message JSON.
 * @param locale - A locale e.g. "en" or "en-GB".
 * @param args - The arguments to be used in the message.
 * @param formatters - The formatters to be used in the message.
 * 
 * @returns The evaluated string.
 */
export const run = <T, U>(
  ...args: Parameters<typeof evaluateAst<T, U>>
) => evaluateAst(...args).join("");

type ValueOf<T> = T[keyof T];

const reduceStrings = <T extends Array<any>>(arr: T): T => arr.reduce((acc, item) => {
  if ([typeof item, typeof acc[acc.length - 1]].some((t) => t !== "string" && t !== "number")) {
    acc.push(item);
  }
  else {
    acc[acc.length - 1] += String(item);
  }
  return acc;
}, [] as any as T);

/**
 * Recursively evaluate ICU expressions like `plural`, `select`, `selectordinal`, `fn` and `tag`
 * and interpolate the values.
 * 
 * @returns The string - might also contain non-string values if non string/number arguments are used.
 */
const getContentValues = <T, U>(
  contents: CompiledAstContents,
  keys: { [keyIndex: number]: string },
  values: Record<string, T>,
  locale: string,
  ordinalValue: number,
  formatters: Record<string, (...args: any[]) => U>
): Array<T | string> => {
  if (typeof contents === "string") {
    return [contents];
  }
  if (contents === -1) {
    return [number(locale, ordinalValue, 0)];
  }

  if (typeof contents === "number") {
    const key = keys[contents];
    return [values[key]];
  }
  const [kind, attr, data] = contents;
  const value = values[keys[attr]];
  ordinalValue = value as number;
  const resolveChildContent = (content: CompiledAstContents[]) => reduceStrings(content
    .map((content) =>
      getContentValues(content, keys, values, locale, ordinalValue, formatters)
    )
    .flat());

  switch (kind) {
    case JSON_AST_TYPE_PLURAL:
    case JSON_AST_TYPE_SELECTORDINAL:
      const key = new Intl.PluralRules(locale, pluralRuleOptions[kind]).select(value as number);
      return resolveChildContent((key in data ? data[key] : data.other) as ValueOf<
        typeof data
      >)
    case JSON_AST_TYPE_SELECT:
      return resolveChildContent(select(String(value), data) as ValueOf<typeof data>);
    case JSON_AST_TYPE_FN:
      return resolveChildContent([
        formatters[data](value, locale, contents[3]) as CompiledAstContents,
      ]);
    case JSON_AST_TYPE_TAG: {
      const tag = keys[attr];
      const fn = (values[tag] as (...args: any) => any) || ((children) => [`<${tag}>`, children, `</${tag}>`]);
      if (process.env.NODE_ENV !== "production") {
        if (typeof fn !== "function") {
          throw new Error(
            `Expected a function for tag "${keys[attr]}", got ${typeof fn}`
          );
        }
      }
      const childPreprocessor = (formatters.children || ((children) => children)) as (children: Array<string | T>, locale: string) => Array<any>;
      return fn(...childPreprocessor(resolveChildContent(contents.slice(2)), locale));
    }
  }
};

const pluralRuleOptions = { 
  // skip JSON_AST_TYPE_PLURAL as it is the default
  3: { type: "ordinal" } 
} as { [key in typeof JSON_AST_TYPE_SELECTORDINAL | typeof JSON_AST_TYPE_PLURAL]: { type: "ordinal" | "cardinal" } };