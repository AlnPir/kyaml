import { assertEquals } from "@std/assert";
import { parse } from "./parse.ts";
import { stringify } from "./stringify.ts";

Deno.test("parse - primitives", () => {
  assertEquals(parse('---\n"hello"\n'), "hello");
  assertEquals(parse("---\n42\n"), 42);
  assertEquals(parse("---\ntrue\n"), true);
  assertEquals(parse("---\nfalse\n"), false);
  assertEquals(parse("---\nnull\n"), null);
});

Deno.test("parse - simple object", () => {
  const kyaml = '---\n{\n  age: 30,\n  name: "john"\n}\n';
  const result = parse(kyaml);

  assertEquals(result, { age: 30, name: "john" });
});

Deno.test("parse - simple array", () => {
  const kyaml = '---\n[\n  "a",\n  "b",\n  "c"\n]\n';
  const result = parse(kyaml);

  assertEquals(result, ["a", "b", "c"]);
});

Deno.test("parse - round trip", () => {
  const original = {
    name: "alice",
    age: 25,
    tags: ["dev", "k8s"],
    config: {
      enabled: true,
      count: 10,
    },
  };

  const kyaml = stringify(original);
  const parsed = parse(kyaml);

  assertEquals(parsed, original);
});
