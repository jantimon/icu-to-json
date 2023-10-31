import { parse, TYPE } from "@formatjs/icu-messageformat-parser";
import type {
  MessageFormatElement,
  NumberSkeleton,
} from "@formatjs/icu-messageformat-parser";
import {
  CompiledArgument,
  CompiledAst,
  CompiledAstContents,
  CompiledFn,
  CompiledOrdinal,
  CompiledPlural,
  CompiledTag,
  JSON_AST_TYPE_FN,
  JSON_AST_TYPE_PLURAL,
  JSON_AST_TYPE_SELECT,
  JSON_AST_TYPE_SELECTORDINAL,
  JSON_AST_TYPE_TAG,
} from "./constants.js";

type Ast = ReturnType<typeof parse>;

interface CompileOptions {
  /** Allow string interpolations like "Hello [0]!" format */
  allowStringInterpolation?: boolean;
}

export const compileToJson = (
  str: string,
  options?: CompileOptions
): CompiledAst => compile(str, options).json;

/**
 * Convert an ICU messageformat string to a json ast which can be render by the icu-to-json runtime.
 */
export const compile = (str: string, options?: CompileOptions) => {
  const ast = parse(str);
  const args = getAllArguments(ast);
  const result = compileAst(ast) satisfies CompiledAst;
  // to reduce the size of the json payload,
  // pure text is returned as a string to save the surrounding array brackets
  const json: CompiledAst =
    result.length === 1 && typeof result[0] === "string" ? result[0] : result;
  // String interpolation is not supported by format.js
  if (typeof json === "string" && options?.allowStringInterpolation) {
    return compileStringInterpolation(json);
  }
  return {
    args,
    json,
  };
};

const compileAst = (ast: Ast): CompiledAstContents[] => {
  return ast.map((node): CompiledAstContents => {
    switch (node.type) {
      case TYPE.literal:
        return node.value;
      case TYPE.argument:
        return [node.value];
      case TYPE.plural:
      case TYPE.select:
        return [
          node.value,
          node.type === TYPE.select
            ? JSON_AST_TYPE_SELECT
            : // in format.js
            // there is no selectordinal type
            // selectordinal is a plural with pluralType = "ordinal"
            node.pluralType === "ordinal"
            ? JSON_AST_TYPE_SELECTORDINAL
            : JSON_AST_TYPE_PLURAL,
          Object.fromEntries(
            Object.entries(node.options).map(([caseName, pluralCase]) => {
              // add support for
              // {{count, plural, one {#} =12{a bunch} other {#s}}}
              return [
                caseName.replace(/^\s*=/, ""),
                compileAst(pluralCase.value),
              ];
            })
          ),
        ] satisfies CompiledPlural;
      case TYPE.tag:
        return [
          node.value,
          JSON_AST_TYPE_TAG,
          ...compileAst(node.children),
        ] satisfies CompiledTag;
      case TYPE.pound:
        // TYPE.pound is the octothorpe character used in plural and selectordinal
        return CompiledOrdinal;
      case TYPE.time:
        return [
          node.value,
          JSON_AST_TYPE_FN,
          "time",
          ...(node.style !== null ? [node.style] : []),
        ] satisfies CompiledFn;
      case TYPE.date:
        return [
          node.value,
          JSON_AST_TYPE_FN,
          "date",
          ...(node.style !== null ? [node.style] : []),
        ] satisfies CompiledFn;
      case TYPE.number:
        return node.style === null
          ? ([
              node.value,
              JSON_AST_TYPE_FN,
              "number",
            ] satisfies CompiledFn)
          : ([
             node.value,
             JSON_AST_TYPE_FN,
              "numberFmt",
              getNumberFormat(node.style),
            ] satisfies CompiledFn);
      default:
        console.log(node);
        throw new Error("Not implemented");
    }
  });
};

export type ArgumentUsage =
  | "argument"
  | "tag"
  | "select"
  | "selectordinal"
  | "number"
  | "numberFmt"
  | "date"
  | "time"
  | "plural";

const getAllArguments = (ast: Ast) => {
  const args: Record<string, ArgumentUsage[]> = {};
  const getArgs = (node: MessageFormatElement) => {
    switch (node.type) {
      case TYPE.literal:
      case TYPE.pound:
        break;
      case TYPE.number:
        if (node.style === null) {
          args[node.value] = addIfNotExists(args[node.value], "number");
        } else {
          args[node.value] = addIfNotExists(args[node.value], "numberFmt");
        }
        break;
      case TYPE.date:
        args[node.value] = addIfNotExists(args[node.value], "date");
        break;
      case TYPE.time:
        args[node.value] = addIfNotExists(args[node.value], "time");
        break;
      case TYPE.tag:
        args[node.value] = addIfNotExists(args[node.value], "tag");
        node.children.forEach(getArgs);
        break;
      case TYPE.plural:
        args[node.value] = addIfNotExists(
          args[node.value],
          node.pluralType === "cardinal" ? "plural" : "selectordinal"
        );
        Object.entries(node.options).forEach(([, pluralCase]) => {
          pluralCase.value.forEach(getArgs);
        });
        break;
      case TYPE.select:
        args[node.value] = addIfNotExists(args[node.value], "select");
        Object.entries(node.options).forEach(([, pluralCase]) => {
          pluralCase.value.forEach(getArgs);
        });
        break;
      case TYPE.argument:
        args[node.value] = addIfNotExists(args[node.value], "argument");
        break;
      default:
        assertNever(node);
    }
  };
  ast.forEach(getArgs);
  return args;
};

/**
 * Compile string interpolations like "Hello [0]!" format
 * to a json ast.
 */
const compileStringInterpolation = (
  str: string
): { args: Record<string, ArgumentUsage[]>; json: CompiledAst } => {
  const translationParts = str
    .split(/\[(\d+)\]/g).map((part, index) => index % 2 === 0 ? part : [parseInt(part, 10)] satisfies CompiledArgument);
  if (translationParts.length === 1) {
    return {
      args: {},
      json: str,
    };
  }
  const argList = [...new Set(translationParts.filter((_, index) => index % 2 === 1))];
  const contents = translationParts satisfies CompiledAstContents[];
  return {
    args: Object.fromEntries(argList.map((arg) => [arg, ["argument"]])),
    json: contents satisfies CompiledAst,
  };
};

function getNumberFormat(style: string | NumberSkeleton | undefined) {
  if (style === "%") {
    return "percent";
  }
  return style;
}

function addIfNotExists<T>(array: T[] | undefined, item: T) {
  if (array === undefined) {
    return [item];
  }
  if (!array.includes(item)) {
    array.push(item);
  }
  return array;
}

function assertNever(x: never) {
  throw new Error("Unexpected object: " + x);
}
