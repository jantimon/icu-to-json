import { number, plural, select } from "./messageformat/runtime.js";

import { type PluralCategory } from "@messageformat/runtime/lib/cardinals";
import { CompiledAst, CompiledAstContents, JSON_AST_TYPE_FN, JSON_AST_TYPE_PLURAL, JSON_AST_TYPE_SELECT, JSON_AST_TYPE_SELECTORDINAL, JSON_AST_TYPE_TAG } from "./constants.js";

export const evaluateAst = <T, U>(
  packedAst: CompiledAst,
  locale: Locale,
  args: Record<string, T>,
  formatters: Record<string, (...args: any[]) => U> = {}
) => {
  // pure text can be returned as string:
  if (typeof packedAst === "string") {
    return [packedAst];
  }
  // unpack the AST:
  const [argNames, ...ast] = packedAst;
  const result = reduceStrings(ast
    .map((contents) =>
      getContentValues(contents, argNames, args, locale, 0, formatters)
    )
    .flat());
  return result;
};

export const run = <T, U>(
  ...args: Parameters<typeof evaluateAst<T, U>>
) => evaluateAst(...args).join("");

type LcFunc = (n: number | string) => PluralCategory;
type ValueOf<T> = T[keyof T];
/** [The current locale, cardinal, ordinal] e.g: `["en-US", require("@messageformat/runtime/lib/cardinals").en, require("make-plural/ordinals").en ]` */
type Locale = readonly [string, LcFunc, LcFunc];

const reduceStrings = <T extends Array<any>>(arr: T): T => arr.reduce((acc, item) => {
  if ([typeof item, typeof acc[acc.length - 1]].some((t) => t !== "string" && t !== "number")) {
    acc.push(item);
  }
  else {
    acc[acc.length - 1] += String(item);
  }
  return acc;
}, [] as any as T);


const getContentValues = <T, U>(
  contents: CompiledAstContents,
  keys: { [keyIndex: number]: string },
  values: Record<string, T>,
  locale: Locale,
  ordinalValue: number,
  formatters: Record<string, (...args: any[]) => U>
): Array<T | string> => {
  if (typeof contents === "string") {
    return [contents];
  }
  if (contents === -1) {
    return [number(locale[0], ordinalValue, 0)];
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
    case JSON_AST_TYPE_PLURAL: {
      return resolveChildContent(plural(value as number, 0, locale[1], data) as ValueOf<
        typeof data
      >)
    }
    case JSON_AST_TYPE_SELECTORDINAL: {
      return resolveChildContent(plural(
        value as number,
        0,
        locale[2],
        data,
        true
      ) as ValueOf<typeof data>)
    }
    case JSON_AST_TYPE_SELECT:
      return resolveChildContent(select(String(value), data) as ValueOf<typeof data>);
    case JSON_AST_TYPE_FN: {
      return resolveChildContent([
        formatters[data](value, locale[0], contents[3]) as CompiledAstContents,
      ]);
    }
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
      return fn(...childPreprocessor(resolveChildContent(contents.slice(2)), locale[0]));
    }
  }
};
