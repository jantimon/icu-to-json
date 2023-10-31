/**
 * JSON Representation of a minimal ICU Message AST
 * 
 * e.g. `"Hello {name}"`
 * -> `["Hello ", ["name"]]`
 * 
 * e.g. `"Hello world"`
 * -> `"Hello world"`
 * 
 */
export type CompiledAst = CompiledPureText | CompiledAstContents[];

/**
 * Part of CompiledAst (@see CompiledAst)
 * Reperesents pure text
 * 
 * e.g.:
 * ```
 * Hello 
 * ```
 */
export type CompiledPureText = string;

/**
 * @internal number representation of an ordinal type
 * e.g.:
 * ```
 * #
 * ```
 */
export const CompiledOrdinal = 0;
export type CompiledOrdinal = typeof CompiledOrdinal;

/**
 * Part of CompiledAst (@see CompiledAst)
 * Represents {plural} and {select} nodes
 * 
 * e.g.:
 * ```
 * {dayTime select morning {Good morning} afternoon {Good afternoon} evening {Good evening} night {Good night}} 
 * 
 * {count plural one {# book} other {# books}}
 * 
 * {count selectordinal one {#st book} two {#nd book} few {#rd book} other {#th book}}
 * ```
 */
export type CompiledPlural = [string, PluralTypes, Record<string, Array<CompiledAstContents>>];

/** 
 * @internal number representation of the type "select"
 * e.g.:
 * ```
 * {dayTime select morning {Good morning} afternoon {Good afternoon} evening {Good evening} night {Good night}} 
 * ```
 */ 
export const JSON_AST_TYPE_SELECT = 1;
/** 
 * @internal number representation of the type "plural"
 * e.g.:
 * ```
 * {count plural one {# book} other {# books}}
 * ```
 */
export const JSON_AST_TYPE_PLURAL = 2;
/** 
 * @internal number representation of the type "selectordinal"
 * e.g.:
 * ```
 * {count selectordinal one {#st book} two {#nd book} few {#rd book} other {#th book}}
 * ```
 */
export const JSON_AST_TYPE_SELECTORDINAL = 3;
type PluralTypes = typeof JSON_AST_TYPE_SELECT | typeof JSON_AST_TYPE_PLURAL | typeof JSON_AST_TYPE_SELECTORDINAL;

/**
 * Part of CompiledAst (@see CompiledAst)
 * Represents {time} and {date} nodes
 * 
 * The underlying parser from format.js does not support functions unlike messageformat.
 * However format.js supports parsing the "time", "date" and "number" functions.
 * 
 * e.g.:
 * ```
 * {time TIME}
 * ```
 */
export type CompiledFn = [string, FnType, string, /* optional param: */...any[]];
/** 
 * @internal number representation of the type "fn"
 * e.g.:
 * ```
 * {time TIME}
 * ```
 */
export const JSON_AST_TYPE_FN = 4;
type FnType = typeof JSON_AST_TYPE_FN;

/**
 * Part of CompiledAst (@see CompiledAst)
 * Represents <tag> nodes
 * 
 * The underlying parser from format.js supports parsing xml tags inside ICU messages.
 * Tags add a lot of flexibility to style richtext messages.
 * 
 * Other parsers like messageformat do not support tags.
 * 
 * e.g.:
 * ```
 * <bold>Hello</bold>
 * ```
 */
export type CompiledTag = [string, TagType, ...CompiledAstContents[]];
/**
 * @internal number representation of the type "tag"
 * e.g.:
 * ```
 * <bold>Hello</bold>
 * ```
 */
export const JSON_AST_TYPE_TAG = 5;
type TagType = typeof JSON_AST_TYPE_TAG;

export type CompiledArgument = [string | number];

/**
 * Part of CompiledAst (@see CompiledAst)
 * Represents all possible types of nodes
 */
export type CompiledAstContents = CompiledPureText | CompiledPlural | CompiledFn | CompiledTag | CompiledArgument | CompiledOrdinal;

/** Supported languages in MessageFormat.js (plural and selectordinal): */
export const availableLanguages = [
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
  