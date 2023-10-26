import { test, beforeAll, beforeEach, afterEach } from "vitest";
import { resolve } from "path";
import { cli } from "../cli.js";

let origArgv: string[];
beforeAll(() => {
  origArgv = process.argv;
});
beforeEach(() => {
  origArgv = process.argv;
});
afterEach(() => {
  process.argv = origArgv;
});

test("cli compile", async () => {
  await cli(
    resolve(__dirname, "__fixtures__/messages.json"),
    resolve(__dirname, "__snapshots__/cli.test.messages.json"),
    false,
    true,
    {
      formats: ["icu", "interpolated"],
    }
  );
});

test("cli --types", async () => {
  await cli(
    resolve(__dirname, "__fixtures__/messages.json"),
    resolve(__dirname, "__snapshots__/cli.test.messages.ts"),
    true,
    true,
    {
      formats: ["icu", "interpolated"],
    }
  );
});
