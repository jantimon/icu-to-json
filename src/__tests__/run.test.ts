import { expect, test } from "vitest";
import { compileToJson } from "../compiler.js";
import { Locale, evaluateAst, run } from "../runtime.js";
import messages from "./__snapshots__/cli.test.messages.json";
import { type MessageArguments, formatters, en } from "./__snapshots__/cli.test.messages.js";

// example t implementation:
const t = <TKey extends keyof MessageArguments>(
  key: TKey,
  locale: Locale,
  args: MessageArguments[TKey],
  tFormatters = formatters
) => {
  return run(
    (messages as any)[locale[0]][key],
    locale,
    args as any,
    tFormatters
  );
};

test("text", () => {
  expect(t("text", en, {})).toMatchInlineSnapshot('"Hello"');
});

test("variable", () => {
  expect(t("variable", en, { name: "Elvis" })).toMatchInlineSnapshot(
    '"Elvis has just entered the chat"'
  );
});

test("plural", () => {
  expect(t("plural", en, { count: 1 })).toMatchInlineSnapshot(
    '"1 image"'
  );
});

test("select", () => {
  expect(
    t("select", en, { friend: "Alex", gender: "female" })
  ).toMatchInlineSnapshot(
    '"Hello, Your friend Alex is now online. She added a new image to the system."'
  );
});

test("selectordinal", () => {
  expect(t("selectordinal", en, { place: 3 })).toMatchInlineSnapshot(
    '"You finished 3th!"'
  );
});

test("fn", () => {
  expect(
    t("fn", en, { currentTime: new Date("2020-02-02 02:02:02") })
  ).toMatchInlineSnapshot(
    '"It is now 2:02:02 AM on Feb 2, 2020"'
  );
});

test("tags", () => {
  expect(
    t("tags", en, { b: (children) => `**${children}**`, dynamic: "⭐️" })
  ).toMatchInlineSnapshot('"Wow formatJs allows **⭐️ tags**"');
});

test("number", () => {
  expect(t("number", en, { numCats: 99 }, {} as any)).toMatchInlineSnapshot(
    '"I have 99 cats."'
  );
});

test("percentage", () => {
  expect(t("percentage", en, { value: 0.03935 })).toMatchInlineSnapshot(
    '"You reached 4% of your goal!"'
  );
});

test("money", () => {
  expect(t("money", en, { amount: 30 })).toMatchInlineSnapshot(
    '"Buy now to save £30.00"'
  );
});

test("integer", () => {
  expect(t("integer", en, { amount: 99.999 })).toMatchInlineSnapshot(
    '"The integer value of 99.999 is 100"'
  );
});

test("time", () => {
  expect(
    t("time", en, { start: new Date("2020-02-02 02:02:02") })
  ).toMatchInlineSnapshot(
    '"Sale begins 2:02 AM at 2/2/2020"'
  );
});

test("evaluateAst with non string argument", () => {
  const json = compileToJson(`Hello {name}!`);
  expect(
    evaluateAst(
      json,
      en,
      {
        name: ["World"],
      },
      {}
    )
  ).toEqual(["Hello ", ["World"], "!"]);
});
