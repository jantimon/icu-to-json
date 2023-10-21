import { compileToJson } from "../compiler.js";
import { test, expect } from "vitest";

test.each([
    ["text", `Hello`],
    ["variable", `{name} has just entered the chat`],
    ["plural", `{count, plural, one {# Bild} other {# Bilder} }`],
    [
      "select",
      `Hello, Your friend {friend} is now online. {gender, select, female {She} male {He} other {They}} added a new image to the system.`,
    ],
    [
      "selectordinal",
      `You finished {place, selectordinal,
            one   {#st}
            two   {#nd}
            few   {#rd}
            other {#th}
        }!`,
    ],
    ["fn", "It is now {currentTime, time} on {currentTime, date}"],
    ["tags", `Wow formatJs allows <b>{dynamic} tags</b>!`],
  ])(`measure size for %s example`, (testName, icuMessage) => {
    const json = compileToJson(icuMessage);
    const size = JSON.stringify(icuMessage).length;
    const jsonSize = JSON.stringify(json).length;
    const percent = Math.round((jsonSize / size) * 100);

    expect(
        [icuMessage, json, `\n` +
        `   size (icu message): ${size}b\n` +
        `   size (json):        ${jsonSize}b\n` +
        `   overhead:           ${percent}%\n`
    ]).toMatchSnapshot()
  });
