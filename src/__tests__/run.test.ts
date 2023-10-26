import { expect, test } from "vitest";
import { compileToJson } from "../compiler.js";
import { evaluateAst, run } from "../runtime.js";
import { createTranslationFn } from "./__snapshots__/cli.test.messages.js";
import messages from "./__snapshots__/cli.test.messages.json";

// example t implementation:
const t = createTranslationFn(messages.en, "en");
const tDe = createTranslationFn(messages["de-DE"], "de-DE");

test("text", () => {
  expect(t("text", {})).toMatchInlineSnapshot('"Hello"');
});

test("variable", () => {
  expect(t("variable", { name: "Elvis" })).toMatchInlineSnapshot(
    '"Elvis has just entered the chat"'
  );
});

test("plural", () => {
  expect(t("plural", { count: 1 })).toMatchInlineSnapshot(
    '"1 image"'
  );
});

test("select", () => {
  expect(
    t("select", { friend: "Alex", gender: "female" })
  ).toMatchInlineSnapshot(
    '"Hello, Your friend Alex is now online. She added a new image to the system."'
  );
});

test("selectNumeric", () => {
  expect(
    t("selectNumeric", { children: 1, city: "Berlin" })
  ).toMatchInlineSnapshot(
    '"She has 1 child and lives in Berlin."'
  );
});

test("selectordinal", () => {
  expect(t("selectordinal", { place: 3 })).toMatchInlineSnapshot(
    '"You finished 3rd!"'
  );
});

test("selectordinal", () => {
  expect(t("interpolatedStrings", ["Joe", 12 ])).toMatchInlineSnapshot(
    '"Hello, my name is Joe and I am 12 years old."'
  );
});

test("fn", () => {
  expect(
    t("fn", { currentTime: new Date("2020-02-02 02:02:02") })
  ).toMatchInlineSnapshot(
    '"It is now 2:02:02 AM on Feb 2, 2020"'
  );
});

test("tags", () => {
  expect(
    t("tags", { b: (children) => `**${children}**`, dynamic: "⭐️" })
  ).toMatchInlineSnapshot('"Wow formatJs allows **⭐️ tags**"');
});

test("number", () => {
  expect(t("number", { numCats: 99 })).toMatchInlineSnapshot(
    '"I have 99 cats."'
  );
});

test("percentage", () => {
  expect(t("percentage", { value: 0.03935 })).toMatchInlineSnapshot(
    '"You reached 4% of your goal!"'
  );
});

test("money", () => {
  expect(t("money", { amount: 30 })).toMatchInlineSnapshot(
    '"Buy now to save £30.00"'
  );
});

test("integer", () => {
  expect(t("integer", { amount: 99.999 })).toMatchInlineSnapshot(
    '"The integer value of 99.999 is 100"'
  );
});

test("time", () => {
  expect(
    t("time", { start: new Date("2020-02-02 02:02:02") })
  ).toMatchInlineSnapshot(
    '"Sale begins 2:02 AM at 2/2/2020"'
  );
});

test("selectordinal DE", () => {
  expect(tDe("selectordinal", { place: 3 })).toMatchInlineSnapshot(
    '"Du hast den 3ten Platz erreicht!"'
  );
});

test("evaluateAst with non string argument", () => {
  const json = compileToJson(`Hello {name}!`);
  expect(
    evaluateAst(
      json,
      "en",
      {
        name: ["World"],
      },
      {}
    )
  ).toEqual(["Hello ", ["World"], "!"]);
});

test("interpolated", () => {
  const json = compileToJson(`Hello [0] [1] [0]!`, { allowStringInterpolation: true });
  expect(
    run(
      json,
      "en",
      {
        0: "Joe",
        1: "Doe"
      },
      {}
    )
  ).toMatchInlineSnapshot('"Hello Joe Doe Joe!"')
});