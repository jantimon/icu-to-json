import { parse, TYPE } from "@formatjs/icu-messageformat-parser";
import type {
  MessageFormatElement,
  NumberSkeleton,
} from "@formatjs/icu-messageformat-parser";
import {
  CompiledArgList,
  CompiledAst,
  CompiledAstContents,
  CompiledFn,
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

export const compile = (str: string, options?: CompileOptions) => {
  const ast = parse(str);
  const args = getAllArguments(ast);
  const argList: CompiledArgList = Object.keys(args);
  const result = [argList, ...compileAst(ast, argList)] satisfies CompiledAst;
  // to reduce the size of the json payload,
  // pure text is returned as a string to save the surrounding array brackets
  const json: CompiledAst =
    result.length === 2 && typeof result[1] === "string" ? result[1] : result;
  // String interpolation is not supported by format.js
  if (typeof json === "string" && options?.allowStringInterpolation) {
    return compileStringInterpolation(json);
  }
  return {
    args,
    json,
  };
};

const compileAst = (ast: Ast, args: string[]): CompiledAstContents[] => {
  return ast.map((node): CompiledAstContents => {
    switch (node.type) {
      case TYPE.literal:
        return node.value;
      case TYPE.argument:
        return args.indexOf(node.value);
      case TYPE.plural:
      case TYPE.select:
        return [
          node.type === TYPE.select
            ? JSON_AST_TYPE_SELECT
            : // in format.js
            // there is no selectordinal type
            // selectordinal is a plural with pluralType = "ordinal"
            node.pluralType === "ordinal"
            ? JSON_AST_TYPE_SELECTORDINAL
            : JSON_AST_TYPE_PLURAL,
          args.indexOf(node.value),
          Object.fromEntries(
            Object.entries(node.options).map(([caseName, pluralCase]) => {
              // add support for
              // {{count, plural, one {#} =12{a bunch} other {#s}}}
              return [
                caseName.replace(/^\s*=/, ""),
                compileAst(pluralCase.value, args),
              ];
            })
          ),
        ] satisfies CompiledPlural;
      case TYPE.tag:
        return [
          JSON_AST_TYPE_TAG,
          args.indexOf(node.value),
          ...compileAst(node.children, args),
        ] satisfies CompiledTag;
      case TYPE.pound:
        // TYPE.pound is the octothorpe character used in plural and selectordinal
        return args.indexOf("#");
      case TYPE.time:
        return [
          JSON_AST_TYPE_FN,
          args.indexOf(node.value),
          "time",
          ...(node.style !== null ? [node.style] : []),
        ] satisfies CompiledFn;
      case TYPE.date:
        return [
          JSON_AST_TYPE_FN,
          args.indexOf(node.value),
          "date",
          ...(node.style !== null ? [node.style] : []),
        ] satisfies CompiledFn;
      case TYPE.number:
        return node.style === null
          ? ([
              JSON_AST_TYPE_FN,
              args.indexOf(node.value),
              "number",
            ] satisfies CompiledFn)
          : ([
              JSON_AST_TYPE_FN,
              args.indexOf(node.value),
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
    .split(/\[(\d+)\]/g);
  if (translationParts.length === 1) {
    return {
      args: {},
      json: str,
    };
  }
  const argList = [...new Set(translationParts.filter((_, index) => index % 2 === 1))];
  const contents = translationParts.map((translationPart, index) => {
    return index % 2 === 0 ? translationPart : argList.indexOf(translationPart);
  }) satisfies CompiledAstContents[];
  return {
    args: Object.fromEntries(argList.map((arg) => [arg, ["argument"]])),
    json: [argList.map(Number) as any[], ...contents] satisfies CompiledAst,
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
