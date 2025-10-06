import { load } from "js-yaml";

/**
 * Parse KYAML string to JavaScript value
 * KYAML is valid YAML, so we use js-yaml
 */
export function parse(kyaml: string): unknown {
  return load(kyaml);
}
