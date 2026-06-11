import { useEffect, useState } from "react";
import ToolTextarea from "../../components/tool/ToolTextarea";
import ToolActions from "../../components/tool/ToolActions";
import Button from "../../ui/Button";
import CopyButton from "../../ui/CopyButton";
import SampleButton from "../../ui/SampleButton";
import { jsonToYaml, yamlToJson } from "../../utils/yamlJsonConverter";

type Direction = "yaml-to-json" | "json-to-yaml";

const SAMPLE_YAML = `name: John
age: 25
skills:
  - JavaScript
  - TypeScript`;

const SAMPLE_JSON = `{
  "name": "John",
  "age": 25,
  "skills": ["JavaScript", "TypeScript"]
}`;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Invalid input format";
}

export default function YamlJsonConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [direction, setDirection] =
    useState<Direction>("yaml-to-json");
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
        direction === "yaml-to-json"
          ? yamlToJson(input)
          : jsonToYaml(input);

      setOutput(result);
    } catch (err) {
      setOutput("");
      setError(getErrorMessage(err));
    }
  }

  function handleSample() {
    setError("");

    try {
      if (direction === "yaml-to-json") {
        setInput(SAMPLE_YAML);
        setOutput(yamlToJson(SAMPLE_YAML));
      } else {
        setInput(SAMPLE_JSON);
        setOutput(jsonToYaml(SAMPLE_JSON));
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

  useEffect(() => {
    setInput("");
    setOutput("");
    setError("");
  }, [direction]);

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-center gap-3">
        <Button
          onClick={() => setDirection("yaml-to-json")}
          variant={direction === "yaml-to-json" ? "primary" : "secondary"}
        >
          YAML to JSON
        </Button>

        <Button
          onClick={() => setDirection("json-to-yaml")}
          variant={direction === "json-to-yaml" ? "primary" : "secondary"}
        >
          JSON to YAML
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ToolTextarea
          label="Input"
          value={input}
          onChange={setInput}
          placeholder={
            direction === "yaml-to-json"
              ? "Paste YAML here..."
              : "Paste JSON here..."
          }
          rightLabel={<SampleButton onClick={handleSample} />}
        />

        <ToolTextarea
          label="Output"
          value={output}
          readOnly
          placeholder="Converted output will appear here..."
          rightLabel={
            canUseOutput ? <CopyButton value={output} /> : undefined
          }
        />
      </div>

      <ToolActions>
        <Button
          variant="primary"
          onClick={handleConvert}
          isDisabled={!hasInput}
        >
          Convert
        </Button>

        {(input || output || error) && (
          <Button variant="secondary" onClick={handleClear}>
            Clear
          </Button>
        )}
      </ToolActions>
    </div>
  );
}