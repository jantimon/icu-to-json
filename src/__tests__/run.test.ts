import { en } from "@messageformat/runtime/lib/cardinals";
import { date, numberFmt, time } from "@messageformat/runtime/lib/formatters";
import { en as enOd } from "make-plural/ordinals";
import { expect, test } from "vitest";
import { compileToJson } from "../compiler.js";
import { Locale, evaluateAst, run } from "../runtime.js";
import messages from "./__snapshots__/cli.test.messages.json";
import type { MessageArguments } from "./__snapshots__/cli.test.messages.js";

const formatters = {
  number: numberFmt,
  date,
  time,
};

// example t implementation:
const t = <TKey extends keyof MessageArguments>(
  key: TKey,
  locale: Locale,
  args: MessageArguments[TKey]
) => {
  return run(
    (messages as any)[locale[0]][key],
    locale,
    args as any,
    formatters
  );
};

const enUS = ["en", en, enOd] as const;

test("text", () => {
  expect(t("text", enUS, {})).toMatchInlineSnapshot('"Hello"');
});

test("variable", () => {
  expect(t("variable", enUS, { name: "Elvis" })).toMatchInlineSnapshot(
    '"Elvis has just entered the chat"'
  );
});

test("plural", () => {
  expect(t("plural", enUS, { count: 1 })).toMatchInlineSnapshot(
    '"1 image"'
  );
});

test("select", () => {
  expect(
    t("select", enUS, { friend: "Alex", gender: "female" })
  ).toMatchInlineSnapshot(
    '"Hello, Your friend Alex is now online. She added a new image to the system."'
  );
});

test("selectordinal", () => {
  expect(t("selectordinal", enUS, { place: 3 })).toMatchInlineSnapshot(
    '"You finished 3rd!"'
  );
});

test("fn", () => {
  expect(
    t("fn", enUS, { currentTime: new Date("2020-02-02 02:02:02") })
  ).toMatchInlineSnapshot(
    '"It is now 2:02:02 AM on Feb 2, 2020"'
  );
});

test("tags", () => {
  expect(
    t("tags", enUS, { b: (children) => `**${children}**`, dynamic: "⭐️" })
  ).toMatchInlineSnapshot('"Wow formatJs allows **⭐️ tags**"');
});

test("number", () => {
  expect(t("number", enUS, { numCats: 99 })).toMatchInlineSnapshot(
    '"I have 99 cats."'
  );
});

test("time", () => {
  expect(
    t("time", enUS, { start: new Date("2020-02-02 02:02:02") })
  ).toMatchInlineSnapshot(
    '"Sale begins 2:02 AM at 2/2/2020"'
  );
});

test("evaluateAst with non string argument", () => {
  const json = compileToJson(`Hello {name}!`);
  expect(
    evaluateAst(
      json,
      enUS,
      {
        name: ["World"],
      },
      {}
    )
  ).toEqual(["Hello ", ["World"], "!"]);
});
