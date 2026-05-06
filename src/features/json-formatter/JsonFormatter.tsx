import { useState } from "react";
import ToolTextarea from "../../components/tool/ToolTextarea";
import ToolActions from "../../components/tool/ToolActions";
import CopyButton from "../../ui/CopyButton";
import SampleButton from "../../ui/SampleButton";
import Button from "../../ui/Button";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const canUseOutput = output && output !== "invalid json";

  const hasInput = input.trim().length > 0;

  function formatJson() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch {
      setOutput("invalid json");
    }
  }

  function loadSample() {
    const compact = '{"name":"DevToolsHub","version":"1.0.0"}';

    setInput(compact);

    try {
      const parsed = JSON.parse(compact);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch {
      setOutput("invalid json");
    }
  }

  function downloadJson() {
    if (!canUseOutput) {
      return;
    }

    const file = new Blob([output], {
      type: "application/json",
    });

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "formatted.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  function clear() {
    setInput("");
    setOutput("");
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/*Input */}
        <ToolTextarea
          label="Input"
          value={input}
          onChange={setInput}
          placeholder="Paste your JSON here (e.g. {'name': 'DevToolsHub'})"
          rows={15}
          rightLabel={
            <SampleButton onClick={loadSample} />
          }
        />

        {/*Output */}
        <ToolTextarea
          label="Output"
          value={output}
          readOnly
          rows={15}
          textColor="accent"
        >
          {canUseOutput && (
            <CopyButton value={output} className="absolute right-4 top-4" />
          )}
        </ToolTextarea>
      </div>

      <ToolActions>
        <Button 
          variant="primary" 
          onClick={formatJson} 
          isDisabled={!hasInput}
        >
          Format JSON
        </Button>

        {output && (
          <Button variant="secondary" onClick={clear}>
            Clear
          </Button>
        )}
      </ToolActions>
    </div>
  );
}
