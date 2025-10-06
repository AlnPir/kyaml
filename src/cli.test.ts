import { assertEquals } from "@std/assert";
import { formatCommand, validateCommand } from "./cli.ts";

Deno.test("formatCommand - converts block-style to KYAML", () => {
  const input = `
name: John
age: 30
tags:
  - dev
  - ops
`;

  const output = formatCommand(input);

  assertEquals(
    output,
    `---
{
  age: 30,
  name: "John",
  tags: [
    "dev",
    "ops"
  ]
}
`,
  );
});

Deno.test("formatCommand - handles already formatted KYAML", () => {
  const input = `---
{
  "name": "Alice"
}
`;

  const output = formatCommand(input);

  assertEquals(
    output,
    `---
{
  name: "Alice"
}
`,
  );
});

Deno.test("validateCommand - accepts valid KYAML", () => {
  const input = `---
{
  age: 25,
  name: "Bob"
}
`;

  const result = validateCommand(input);

  assertEquals(result.valid, true);
  assertEquals(result.error, undefined);
});

Deno.test("validateCommand - rejects block-style YAML", () => {
  const input = `
name: Charlie
age: 35
`;

  const result = validateCommand(input);

  assertEquals(result.valid, false);
  assertEquals(
    result.error,
    "Input is valid YAML but not canonical KYAML format",
  );
});

Deno.test("validateCommand - rejects invalid YAML", () => {
  const input = `{{{invalid}}}`;

  const result = validateCommand(input);

  assertEquals(result.valid, false);
  assertEquals(typeof result.error, "string");
});

Deno.test("formatCommand - preserves types", () => {
  const input = `
number: 42
boolean: true
null_value: null
string: "quoted"
`;

  const output = formatCommand(input);

  assertEquals(
    output,
    `---
{
  boolean: true,
  null_value: null,
  number: 42,
  string: "quoted"
}
`,
  );
});

Deno.test("formatCommand - handles nested structures", () => {
  const input = `
user:
  name: Dave
  roles:
    - admin
    - user
`;

  const output = formatCommand(input);

  assertEquals(
    output,
    `---
{
  user: {
    name: "Dave",
    roles: [
      "admin",
      "user"
    ]
  }
}
`,
  );
});
