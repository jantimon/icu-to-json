import {
  type CompiledAst,
  type CompiledAstContents,
  JSON_AST_TYPE_FN,
  JSON_AST_TYPE_PLURAL,
  JSON_AST_TYPE_SELECT,
  JSON_AST_TYPE_SELECTORDINAL,
  JSON_AST_TYPE_TAG,
  CompiledOrdinal,
} from "./constants.js";
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
  ast: CompiledAst,
  locale: string,
  args: Record<string, T>,
  formatters?: Record<string, (...args: any[]) => U>
) => {
  // pure text can be returned as string:
  if (typeof ast === "string") {
    return [ast];
  }
  const withDefaultFormatters = {
    number,
    baseTag: (tag: string, ...children: Array<string | T>) => ([
      `<${tag}>`,
      ...children,
      `</${tag}>`,
    ] as U),
    ...formatters,
  };
  const result = reduceStrings(
    ast
      .map((contents) =>
        getContentValues<T, U>(
          contents,
          args,
          locale,
          0,
          withDefaultFormatters
        )
      )
      .flat()
  );
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
export const run = <T, U>(...args: Parameters<typeof evaluateAst<T, U>>) =>
  evaluateAst(...args).join("");

const reduceStrings = <T extends Array<any>>(arr: T): T =>
  arr.reduce((acc, item) => {
    if (
      [typeof item, typeof acc[acc.length - 1]].some(
        (t) => t !== "string" && t !== "number"
      )
    ) {
      acc.push(item);
    } else {
      acc[acc.length - 1] += String(item);
    }
    return acc;
  }, [] as unknown[] as T);

/**
 * Recursively evaluate ICU expressions like `plural`, `select`, `selectordinal`, `fn` and `tag`
 * and interpolate the values.
 *
 * @returns The string - might also contain non-string values if non string/number arguments are used.
 */
const getContentValues = <T, U>(
  contents: CompiledAstContents,
  values: Record<string, T>,
  locale: string,
  ordinalValue: number,
  formatters: Record<string, (...args: any[]) => (U | string)>
): Array<T | string> => {
  if (typeof contents === "string") {
    return [contents];
  }
  if (contents === CompiledOrdinal) {
    return [number(ordinalValue, locale)];
  }
  const [attr, kind, data] = contents;
  const value = values[attr as keyof typeof values];
  // The Compiled Attribute Node has no Kind to save space
  if (!kind) {
    return [value];
  }
  const resolveChildContent = (contents: CompiledAstContents[]) =>
    reduceStrings(
      contents
        .map((content) =>
          getContentValues(
            content,
            values,
            locale,
            value as number,
            formatters
          )
        )
        .flat()
    );
  switch (kind) {
    case JSON_AST_TYPE_SELECT:
    case JSON_AST_TYPE_PLURAL:
    case JSON_AST_TYPE_SELECTORDINAL:
      // a direct match e.g. {{children, plural, =0 {no children} =1 {1 child} other {# children}}
      if ({}.hasOwnProperty.call(data!, value as string)) {
        return resolveChildContent(
          (data!)[value as string]
        );
      } else if (kind === JSON_AST_TYPE_SELECT) {
        // select always falls back to "other" if the direct match is not found
        return resolveChildContent((data!).other as CompiledAstContents[]);
      }
      // plural/selectordinal need to find the correct plural rule if no direct match is found
      // only if that fails, fall back to "other"
      // e.g.: {{count, plural, one {1 image} =99 {Many Many} other {# images}}}
      const key = new Intl.PluralRules(locale, pluralRuleOptions[kind]).select(
        value as number
      );
      return resolveChildContent(
        (key in (data!) ? (data!)[key] : (data!).other) as CompiledAstContents[]
      );
    case JSON_AST_TYPE_FN:
      // Functions are used for date, time and number formatting
      return resolveChildContent([
        formatters[data!](value, locale, contents[3]) as CompiledAstContents,
      ]);
    case JSON_AST_TYPE_TAG: {
      /** The tag name e.g. "strong" for "<strong>Demo</strong>" */
      const tagRenderer =
        (values[attr] as (...args: any) => any) ||
        formatters.baseTag.bind(contents, attr);

      if (process.env.NODE_ENV !== "production") {
        if (typeof tagRenderer !== "function") {
          throw new Error(
            `Expected a function for tag "${attr}", got ${typeof tagRenderer}`
          );
        }
      }
      return tagRenderer(
        ...(
          // Allow preprocessing the children of any tag
          // this allows wrapping them with a React Fragment 
          // or to merge them into a single DOM node
          (formatters.tag ||
            ((children) => children)) as (
              children: Array<string | T>,
              locale: string
            ) => Array<any>
        )(
          // Process the children of the tag before the tag itself
          // e.g. a plural or text interpolation inside a tag
          resolveChildContent(contents.slice(2) as CompiledAstContents[]), locale)
      );
    }
  }
};

const pluralRuleOptions = {
  // skip JSON_AST_TYPE_PLURAL as "cardinal" is the default type
  3: { type: "ordinal" },
} as {
    [key in typeof JSON_AST_TYPE_SELECTORDINAL | typeof JSON_AST_TYPE_PLURAL]: {
      type: "ordinal" | "cardinal";
    };
  };

/**
 * Utility function for `#` in plural rules
 * Copied from @messageformat/runtime
 *
 * @param locale The current locale
 * @param value The value to operate on
 * @returns Format the input value
 */
const number = (
  value: number,
  locale: string,
): string =>
  // @ts-ignore
  ((number[locale] || (number[locale] = new Intl.NumberFormat(locale))) as Intl.NumberFormat).format(
    value
  );
