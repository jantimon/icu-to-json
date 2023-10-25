import { date, time, numberFmt } from "@messageformat/runtime/lib/formatters";
import { type CompiledAst, evaluateAst, run } from "icu-to-json";
export const formatters = { date, time, numberFmt };
export type MessageArguments<TArgumentType = number | string, TArgumentTagType = (children: TArgumentType) => TArgumentType> = {
  "fn": {
    "currentTime": Date | number | string;
  },
  "integer": {
    "amount": number;
  },
  "money": {
    "amount": number;
  },
  "number": {
    "numCats": number;
  },
  "percentage": {
    "value": number;
  },
  "plural": {
    "count": number;
  },
  "select": {
    "friend": TArgumentType;
    "gender": number | string;
  },
  "selectordinal": {
    "place": number;
  },
  "tags": {
    "b": TArgumentTagType;
    "dynamic": TArgumentType;
  },
  "text"?: never | Record<string, never>,
  "time": {
    "start": Date | number | string;
  },
  "variable": {
    "name": TArgumentType;
  }
};
export type Language = "de-DE" | "en" | "es" | "fr" | "it";


/**
  * This function is used to create a translation function that returns a string
  */
export const createTranslationFn = (messages: Record<string, unknown>, lang: Language) => 
  <TKey extends keyof MessageArguments>(key: TKey, args: MessageArguments[TKey]): string => run(messages[key] as CompiledAst, lang, args as Record<string, string | number | Date>, formatters);
/**
  * This function is used to create a translation function that returns a rich AST
  */
export const createTranslationRitchFn = (messages: Record<string, unknown>, lang: Language, childPreprocessor?: (children: unknown) => any) => {
  const richFormatters = {...formatters, children: childPreprocessor} as any;
  return <TKey extends keyof MessageArguments>(key: TKey, args: MessageArguments[TKey]) => evaluateAst(messages[key] as CompiledAst, lang, args as Record<string, string | number | Date>, richFormatters);
};