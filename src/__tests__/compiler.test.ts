import { compileToJson } from "../compiler.js";
import { test, expect } from "vitest";
import messages from "./__fixtures__/messages.json";

test.each(Object.entries(messages.en))(`measure size for %s example`, (testName, icuMessage) => {
    const json = compileToJson(icuMessage);
    const size = JSON.stringify(icuMessage).length;
    const jsonSize = JSON.stringify(json).length;
    const percent = Math.round((jsonSize / size) * 100) - 100;

    expect(
        [icuMessage, json, `\n` +
        `   size (icu message): ${size}b\n` +
        `   size (json):        ${jsonSize}b\n` +
        `   overhead:           ${percent > 0 ? "+":""}${percent}%\n`
    ]).toMatchSnapshot()
  });
