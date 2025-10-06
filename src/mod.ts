/**
 * KYAML - A strict, safe subset of YAML
 * Based on Kubernetes KEP-5295
 */

export { stringify } from "./stringify.ts";
export { parse } from "./parse.ts";

import { parse } from "./parse.ts";
import { stringify } from "./stringify.ts";

/**
 * Format existing YAML to KYAML
 */
export function format(yaml: string): string {
  return stringify(parse(yaml));
}
