// The following types help to avoid bundling the esm wrapper of @messageformat/runtime
// saving 0.5KB in the final bundle size
export const number: typeof import("../../node_modules/@messageformat/runtime/lib/runtime.js").number;