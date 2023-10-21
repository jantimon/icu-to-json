/**
 * JSON Representation of a minimal ICU Message AST
 * 
 * e.g. `Hello {name}`
 * -> `["name", "Hello ", 0]`
 * 
 */
export type CompiledAst = CompiledPureText | [CompiledArgList, ...CompiledAstContents[]];

/**
 * Part of CompiledAst (@see CompiledAst)
 * Reperesents the list of all arguments and tag names e.g. `["name"]` in `Hello {name}`
 * It allows to separate static text from argument names.
 */
export type CompiledArgList = string[];

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
export type CompiledPlural = [PluralTypes, number, Record<string, Array<number | CompiledAstContents>>];
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
export type CompiledFn = [FnType, number, string, /* optional param: */...any[]];
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
export type CompiledTag = [TagType, number, ...CompiledAstContents[]];
/**
 * @internal number representation of the type "tag"
 * e.g.:
 * ```
 * <bold>Hello</bold>
 * ```
 */
export const JSON_AST_TYPE_TAG = 5;
type TagType = typeof JSON_AST_TYPE_TAG;

/**
 * Part of CompiledAst (@see CompiledAst)
 * Represents all possible types of nodes
 */
export type CompiledAstContents = CompiledPureText | number | CompiledPlural | CompiledFn | CompiledTag;