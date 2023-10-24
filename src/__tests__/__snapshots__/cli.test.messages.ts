import type { Locale } from "icu-to-json";
import { date, time, numberFmt } from "@messageformat/runtime/lib/formatters";
import { de as dePlural, en as enPlural, es as esPlural, fr as frPlural, it as itPlural } from "make-plural/plurals";
import { de as deOrdinal, en as enOrdinal, es as esOrdinal, fr as frOrdinal, it as itOrdinal } from "@messageformat/runtime/lib/cardinals";
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
export const de: Locale = ["de", dePlural, deOrdinal];
export const en: Locale = ["en", enPlural, enOrdinal];
export const es: Locale = ["es", esPlural, esOrdinal];
export const fr: Locale = ["fr", frPlural, frOrdinal];
export const it: Locale = ["it", itPlural, itOrdinal];
const locales = {de: [dePlural, deOrdinal], en: [enPlural, enOrdinal], es: [esPlural, esOrdinal], fr: [frPlural, frOrdinal], it: [itPlural, itOrdinal]} as const;


const getLocale = (lang: Language) => [lang, ...locales[lang.split("-")[0] as keyof typeof locales]] as Locale;
/**
  * This function is used to create a translation function that returns a string
  */
export const createTranslationFn = (messages: Record<string, unknown>, lang: Language) => {
  const locale = getLocale(lang);
  return <TKey extends keyof MessageArguments>(key: TKey, args: MessageArguments[TKey]): string => run(messages[key] as CompiledAst, locale, args as Record<string, string | number | Date>, formatters);
};
/**
  * This function is used to create a translation function that returns a rich AST
  */
export const createTranslationRitchFn = (messages: Record<string, unknown>, lang: Language, childPreprocessor?: (children: unknown) => any) => {
  const locale = getLocale(lang);
  const richFormatters = {...formatters, children: childPreprocessor} as any;
  return <TKey extends keyof MessageArguments>(key: TKey, args: MessageArguments[TKey]) => evaluateAst(messages[key] as CompiledAst, locale, args as Record<string, string | number | Date>, richFormatters);
};