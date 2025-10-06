# kyaml

A strict, safe subset of YAML based on
[Kubernetes KEP-5295](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cli/5295-kyaml/README.md).

## Why KYAML?

YAML has many ambiguities and gotchas (the "Norway problem", whitespace
sensitivity, etc.). KYAML is an opinionated subset that:

- ✅ Always uses `{}` for objects and `[]` for arrays (flow style)
- ✅ Double-quotes all strings
- ✅ Not whitespace-sensitive
- ✅ Allows trailing commas
- ✅ 100% compatible with existing YAML parsers

## Installation

### Deno

```typescript
import { format, parse, stringify } from "jsr:@alnpir/kyaml";
```

### Node.js / npm

```bash
npx jsr add @alnpir/kyaml
```

Then import:

```typescript
import { format, parse, stringify } from "@alnpir/kyaml";
```

### CLI Tool

```bash
# Install globally
deno install -g -A --name kyaml jsr:@alnpir/kyaml/cli

# Or run directly
deno run -A jsr:@alnpir/kyaml/cli format config.yaml
```

## Usage

### Command Line

```bash
# Format a YAML file to KYAML
kyaml format input.yaml > output.kyaml

# Validate if a file is KYAML
kyaml validate config.kyaml

# Use with pipes
cat messy.yaml | kyaml format > clean.kyaml
```

### Programmatic

```typescript
import { format, parse, stringify } from "jsr:@alnpir/kyaml";

// Convert object to KYAML
const obj = { name: "John", age: 30, tags: ["dev", "k8s"] };
const kyaml = stringify(obj);
// Output:
// ---
// {
//   "age": 30,
//   "name": "John",
//   "tags": ["dev", "k8s"]
// }

// Parse KYAML (uses js-yaml internally)
const parsed = parse(kyaml);

// Format existing YAML to KYAML
const yaml = "name: John\nage: 30";
const formatted = format(yaml);
```

## API

### `stringify(value: any): string`

Converts a JavaScript value to KYAML format.

### `parse(kyaml: string): any`

Parses KYAML string to JavaScript value (wrapper around js-yaml).

### `format(yaml: string): string`

Reformats existing YAML to KYAML format.

## Development

This project uses:

- **Conventional Commits** - Commit messages must follow the format: `feat:`, `fix:`, `docs:`, etc.
- **Semantic Release** - Versions are automatically bumped based on commits
- **Renovate** - Dependencies are automatically updated

### Contributing

1. Fork and clone
2. `deno install` - Install dependencies
3. `deno task prepare` - Setup git hooks
4. Make changes using conventional commits
5. Push - CI will run tests, and releases happen automatically on main

## License

MIT

## Credits

Based on the
[KYAML specification (KEP-5295)](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cli/5295-kyaml/README.md)
by Kubernetes SIG-CLI.
