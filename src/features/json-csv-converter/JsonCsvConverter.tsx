import { useState } from "react";
import ToolTextarea from "../../components/tool/ToolTextarea";
import ToolActions from "../../components/tool/ToolActions";
import Button from "../../ui/Button";
import CopyButton from "../../ui/CopyButton";
import SampleButton from "../../ui/SampleButton";
import { csvToJson, jsonToCsv } from "../../utils/jsonCsvConverter";

type Direction = "json-to-csv" | "csv-to-json";

export const SAMPLE_JSON = `[
  { "name": "John", "age": 25 },
  { "name": "Jane", "age": 30 }
]`;

export const SAMPLE_CSV = `name,age
John,25
Jane,30`;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Invalid input format";
}

export default function JsonCsvConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [direction, setDirection] = useState<Direction>("json-to-csv");
  const [error, setError] = useState("");

  const hasInput = input.trim().length > 0;
  const canUseOutput = output.trim().length > 0 && !error;

  function handleConvert() {
    try {
      setError("");

      if (!hasInput) {
        throw new Error("Input cannot be empty.");
      }

      const result =
        direction === "json-to-csv" ? jsonToCsv(input) : csvToJson(input);

      setOutput(result);
    } catch (err) {
      setOutput("");
      setError(getErrorMessage(err));
    }
  }

  function handleSample() {
    setError("");

    try {
      if (direction === "json-to-csv") {
        setInput(SAMPLE_JSON);
        const result = jsonToCsv(SAMPLE_JSON);
        setOutput(result);
      } else {
        setInput(SAMPLE_CSV);
        const result = csvToJson(SAMPLE_CSV);
        setOutput(result);
      }
    } catch (err) {
      setOutput("");
      setError(getErrorMessage(err));
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError("");
  }

  return (
    <div className="w-full space-y-4">
      {/* Direction Switcher */}
      <div className="flex justify-center gap-3">
        <Button
          onClick={() => setDirection("json-to-csv")}
          variant={direction === "json-to-csv" ? "primary" : "secondary"}
        >
          JSON to CSV
        </Button>

        <Button
          onClick={() => setDirection("csv-to-json")}
          variant={direction === "csv-to-json" ? "primary" : "secondary"}
        >
          CSV to JSON
        </Button>
      </div>

      {/* Error */}
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      {/* Two Panel Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ToolTextarea
          label="Input"
          value={input}
          onChange={setInput}
          placeholder={
            direction === "json-to-csv"
              ? 'Paste JSON array e.g. [{ "name": "John" }]'
              : "Paste CSV here..."
          }
          rightLabel={<SampleButton onClick={handleSample} />}
        />

        <ToolTextarea
          label="Output"
          value={output}
          readOnly
          onChange={() => {}}
          placeholder="Converted output will appear here..."
        />
      </div>

      {/* Actions */}
      <ToolActions>
        <Button onClick={handleConvert} isDisabled={!hasInput}>
          Convert
        </Button>

        {canUseOutput && <CopyButton value={output} />}

        {(input || output || error) && (
          <Button onClick={handleClear} variant="secondary">
            Clear
          </Button>
        )}
      </ToolActions>
    </div>
  );
}
