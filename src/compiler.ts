import { parse, TYPE } from '@formatjs/icu-messageformat-parser';
import type { MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import { CompiledArgList, CompiledAst, CompiledAstContents, CompiledFn, CompiledPlural, CompiledTag, JSON_AST_TYPE_FN, JSON_AST_TYPE_PLURAL, JSON_AST_TYPE_SELECT, JSON_AST_TYPE_SELECTORDINAL, JSON_AST_TYPE_TAG } from './constants.js';

type Ast = ReturnType<typeof parse>;

export const compileToJson = (str: string): CompiledAst => {
    const ast = parse(str);
    const args: CompiledArgList = getAllArguments(ast);
    const result = [args, ...compileAst(ast, args)] satisfies CompiledAst;
    // to reduce the size of the json payload,
    // pure text is returned as a string to save the surrounding array brackets
    if (result.length === 2 && typeof result[1] === "string") {
        return result[1];
    }
    return result;
}

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
                    node.type === TYPE.select ? JSON_AST_TYPE_SELECT : 
                    // in format.js
                    // there is no selectordinal type
                    // selectordinal is a plural with pluralType = "ordinal"
                    (
                        node.pluralType === "ordinal" ? JSON_AST_TYPE_SELECTORDINAL : JSON_AST_TYPE_PLURAL
                    ),
                    args.indexOf(node.value),
                    Object.fromEntries(Object.entries(node.options).map(([caseName,pluralCase]) => {
                        return [ caseName, compileAst(pluralCase.value, args)]
                    }))
                ] satisfies CompiledPlural;
            case TYPE.tag:
                return [
                    JSON_AST_TYPE_TAG,
                    args.indexOf(node.value),
                    ...compileAst(node.children, args)
                ] satisfies CompiledTag;
            case TYPE.pound:
                // TYPE.pound is the octothorpe character used in plural and selectordinal
                return args.indexOf("#");
            case TYPE.time:
                return [
                    JSON_AST_TYPE_FN,
                    args.indexOf(node.value),
                    "time",
                    node.style
                ] satisfies CompiledFn;
            case TYPE.date:
                return [
                    JSON_AST_TYPE_FN,
                    args.indexOf(node.value),
                    "date",
                    node.style
                ] satisfies CompiledFn;
            default:
                console.log(node);
                throw new Error("Not implemented");
            }
    });
}

const getAllArguments = (ast: Ast): string[] => {
    const args = new Set<string>();
    const getArgs = (node: MessageFormatElement) => {
        switch (node.type) {
            case TYPE.literal:
            case TYPE.pound:
                break;
            case TYPE.number:
            case TYPE.date:
            case TYPE.time:
                args.add(node.value);
                break;
            case TYPE.tag:
                args.add(node.value);
                node.children.forEach(getArgs);
                break;
            case TYPE.plural:
            case TYPE.select:
                args.add(node.value);
                Object.entries(node.options).forEach(([,pluralCase]) => {
                    pluralCase.value.forEach(getArgs);
                });
                break;
            case TYPE.argument:
                args.add(node.value);
                break;
            default:
                assertNever(node);
        }
    }
    ast.forEach(getArgs);
    return [...args];
}

function assertNever(x: never) {
    throw new Error("Unexpected object: " + x);
}

