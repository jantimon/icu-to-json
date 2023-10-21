// The following direct import helps to avoid bundling the esm wrapper of @messageformat/runtime
// saving 0.5KB in the final bundle size.
export { number, plural, select } from "../../node_modules/@messageformat/runtime/esm/runtime.js";