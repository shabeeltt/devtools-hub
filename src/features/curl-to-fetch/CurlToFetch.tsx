import { useState } from "react";
import { toJavaScript } from "curlconverter";
import ToolTextarea from "../../components/tool/ToolTextarea";
import ToolActions from "../../components/tool/ToolActions";
import Button from "../../ui/Button";
import CopyButton from "../../ui/CopyButton";
import SampleButton from "../../ui/SampleButton";

export default function CurlToFetch() {
  const [curlInput, setCurlInput] = useState("");
  const [fetchOutput, setFetchOutput] = useState("");

  const sampleCurl = `curl -X POST https://api.example.com/users \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer token123" \\
-d '{"name":"John","email":"john@example.com"}'`;

  const convertCurlToFetch = () => {
    try {
      const input = curlInput.trim();

      if (!input) {
        setFetchOutput("Please enter a curl command");
        return;
      }

      if (!input.startsWith("curl")) {
        setFetchOutput("Invalid curl command");
        return;
      }

      const result = toJavaScript(input);
      setFetchOutput(result.trim());
    } catch {
      setFetchOutput("Failed to convert curl command");
    }
  };

  const loadSample = () => {
    setCurlInput(sampleCurl);
  };

  const clearAll = () => {
    setCurlInput("");
    setFetchOutput("");
  };

  return (
    <div className="space-y-6">
      <ToolTextarea
        label="Curl Command"
        value={curlInput}
        onChange={setCurlInput}
        rows={8}
        placeholder="Paste curl command here..."
      >
        <SampleButton onClick={loadSample} />
      </ToolTextarea>

      <ToolActions>
        <Button onClick={convertCurlToFetch}>Convert</Button>

        <Button variant="secondary" onClick={clearAll}>
          Clear
        </Button>
      </ToolActions>

      <ToolTextarea
        label="Fetch Output"
        value={fetchOutput}
        readOnly
        rows={10}
        rightLabel={<CopyButton value={fetchOutput} />}
      />
    </div>
  );
}
