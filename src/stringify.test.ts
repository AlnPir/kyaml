import { assertEquals, assertMatch } from "@std/assert";
import { stringify } from "./stringify.ts";

Deno.test("stringify - primitives", () => {
  assertEquals(stringify("hello"), '---\n"hello"\n');
  assertEquals(stringify(42), "---\n42\n");
  assertEquals(stringify(3.14), "---\n3.14\n");
  assertEquals(stringify(true), "---\ntrue\n");
  assertEquals(stringify(false), "---\nfalse\n");
  assertEquals(stringify(null), "---\nnull\n");
});

Deno.test("stringify - empty collections", () => {
  assertEquals(stringify({}), "---\n{}\n");
  assertEquals(stringify([]), "---\n[]\n");
});

Deno.test("stringify - simple object", () => {
  const obj = { name: "john", age: 30 };
  const result = stringify(obj);

  // Should use {}, keys unquoted (safe), values quoted for strings
  assertMatch(result, /---/);
  assertMatch(result, /{/);
  assertMatch(result, /}/);
  assertMatch(result, /age: 30/);
  assertMatch(result, /name: "john"/);
});

Deno.test("stringify - simple array", () => {
  const arr = ["a", "b", "c"];
  const result = stringify(arr);

  // Should use []
  assertMatch(result, /---/);
  assertMatch(result, /\[/);
  assertMatch(result, /\]/);
  assertMatch(result, /"a"/);
  assertMatch(result, /"b"/);
  assertMatch(result, /"c"/);
});

Deno.test("stringify - nested object", () => {
  const obj = {
    user: {
      name: "alice",
      age: 25,
    },
  };
  const result = stringify(obj);

  assertMatch(result, /user: {/);
  assertMatch(result, /name: "alice"/);
  assertMatch(result, /age: 25/);
});

Deno.test("stringify - array of objects", () => {
  const arr = [
    { id: 1, name: "first" },
    { id: 2, name: "second" },
  ];
  const result = stringify(arr);

  assertMatch(result, /\[/);
  assertMatch(result, /{/);
  assertMatch(result, /id: 1/);
  assertMatch(result, /name: "first"/);
});

Deno.test("stringify - keys are sorted", () => {
  const obj = { zebra: 1, apple: 2, middle: 3 };
  const result = stringify(obj);

  // apple should come before middle, middle before zebra
  const applePos = result.indexOf("apple");
  const middlePos = result.indexOf("middle");
  const zebraPos = result.indexOf("zebra");

  assertEquals(applePos < middlePos, true);
  assertEquals(middlePos < zebraPos, true);
});

Deno.test("stringify - special characters in strings", () => {
  const obj = { message: 'hello "world"\nnewline' };
  const result = stringify(obj);

  // Should escape quotes and newlines
  assertMatch(result, /message:/);
  assertMatch(result, /\\"/); // escaped quote
  assertMatch(result, /\\n/); // escaped newline
});
