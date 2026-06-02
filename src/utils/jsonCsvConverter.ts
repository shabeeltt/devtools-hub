import Papa from "papaparse";

export function jsonToCsv(input: string): string {
  const parsed = JSON.parse(input);

  if (!Array.isArray(parsed)) {
    throw new Error("JSON must be an array of objects.");
  }

  return Papa.unparse(parsed);
}

export function csvToJson(input: string): string {
  const result = Papa.parse(input, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length > 0) {
    throw new Error(result.errors[0].message);
  }

  return JSON.stringify(result.data, null, 2);
}
