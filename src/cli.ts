#!/usr/bin/env -S deno run --allow-read --allow-write

import { parse, stringify } from "./mod.ts";

/**
 * CLI commands for kyaml
 */

function printUsage(): void {
  console.log(`
kyaml - Format and validate KYAML files

USAGE:
  kyaml format <file>     Format a YAML file to KYAML
  kyaml validate <file>   Validate if a file is valid KYAML
  kyaml help              Show this help message

EXAMPLES:
  kyaml format config.yaml
  kyaml validate config.kyaml
  cat input.yaml | kyaml format
`);
}

async function readInput(filePath?: string): Promise<string> {
  if (filePath) {
    return await Deno.readTextFile(filePath);
  }

  // Read from stdin
  const decoder = new TextDecoder();
  const chunks: Uint8Array[] = [];

  for await (const chunk of Deno.stdin.readable) {
    chunks.push(chunk);
  }

  const combined = new Uint8Array(
    chunks.reduce((acc, chunk) => acc + chunk.length, 0),
  );
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  return decoder.decode(combined);
}

function formatCommand(input: string): string {
  const data = parse(input);
  return stringify(data);
}

function validateCommand(input: string): { valid: boolean; error?: string } {
  try {
    const data = parse(input);
    const formatted = stringify(data);

    // KYAML is valid if it parses and matches the canonical format
    // Allow whitespace differences
    const normalized = (s: string) => s.replace(/\s+/g, " ").trim();

    if (normalized(input) === normalized(formatted)) {
      return { valid: true };
    }

    return {
      valid: false,
      error: "Input is valid YAML but not canonical KYAML format",
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function main(): Promise<void> {
  const args = Deno.args;

  if (args.length === 0 || args[0] === "help" || args[0] === "--help") {
    printUsage();
    Deno.exit(0);
  }

  const command = args[0];
  const filePath = args[1];

  try {
    const input = await readInput(filePath);

    switch (command) {
      case "format": {
        const output = formatCommand(input);
        console.log(output);
        break;
      }

      case "validate": {
        const result = validateCommand(input);
        if (result.valid) {
          console.log("✓ Valid KYAML");
          Deno.exit(0);
        } else {
          console.error(`✗ Invalid KYAML: ${result.error}`);
          Deno.exit(1);
        }
        break;
      }

      default:
        console.error(`Unknown command: ${command}`);
        printUsage();
        Deno.exit(1);
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : error}`);
    Deno.exit(1);
  }
}

// Run if called directly
if (import.meta.main) {
  main();
}

export { formatCommand, validateCommand };
