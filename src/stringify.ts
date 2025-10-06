/**
 * Stringify a value to KYAML format
 */
export function stringify(value: unknown, indent = 2): string {
  return `---\n${renderValue(value, 0, indent)}\n`;
}

function renderValue(value: unknown, depth: number, indent: number): string {
  // Null
  if (value === null || value === undefined) {
    return "null";
  }

  // Boolean
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  // Number
  if (typeof value === "number") {
    return String(value);
  }

  // String - always double-quoted and escaped
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  // Array
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }
    return renderArray(value, depth, indent);
  }

  // Object
  if (typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 0) {
      return "{}";
    }
    return renderObject(value as Record<string, unknown>, depth, indent);
  }

  // Fallback
  return "null";
}

function renderArray(arr: unknown[], depth: number, indent: number): string {
  const indentStr = " ".repeat(depth * indent);
  const nextIndent = " ".repeat((depth + 1) * indent);

  const items = arr.map((item) => {
    const rendered = renderValue(item, depth + 1, indent);
    return `${nextIndent}${rendered}`;
  });

  return `[\n${items.join(",\n")}\n${indentStr}]`;
}

function renderObject(
  obj: Record<string, unknown>,
  depth: number,
  indent: number,
): string {
  const indentStr = " ".repeat(depth * indent);
  const nextIndent = " ".repeat((depth + 1) * indent);

  // Sort keys alphabetically
  const keys = Object.keys(obj).sort();

  const pairs = keys.map((key) => {
    const formattedKey = formatKey(key);
    const value = renderValue(obj[key], depth + 1, indent);
    return `${nextIndent}${formattedKey}: ${value}`;
  });

  return `{\n${pairs.join(",\n")}\n${indentStr}}`;
}

// Format keys: unquoted unless they need quotes
function formatKey(key: string): string {
  // Ambiguous words that need quotes
  const ambiguous = ["true", "false", "null", "yes", "no", "on", "off"];

  // Check if key is safe to leave unquoted
  const isSafe = /^[a-zA-Z_][a-zA-Z0-9_.-]*$/.test(key);
  const needsQuotes = !isSafe || ambiguous.includes(key.toLowerCase());

  return needsQuotes ? JSON.stringify(key) : key;
}
