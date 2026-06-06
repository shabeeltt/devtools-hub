import YAML from "yaml";

export function yamlToJson(input: string): string {
  const parsed = YAML.parse(input);
  return JSON.stringify(parsed, null, 2);
}

export function jsonToYaml(input: string): string {
  const parsed = JSON.parse(input);
  return YAML.stringify(parsed);
}