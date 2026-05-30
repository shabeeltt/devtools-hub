import { useState } from "react";
import ToolTextarea from "../../components/tool/ToolTextarea";
import ToolActions from "../../components/tool/ToolActions";
import Button from "../../ui/Button";
import CopyButton from "../../ui/CopyButton";
import SampleButton from "../../ui/SampleButton";

export default function CurlToFetch() {
  const [curlInput, setCurlInput] = useState("");
  const [fetchOutput, setFetchOutput] = useState("");

  const sampleCurl = `curl -X POST https://api.example.com/users \
-H "Content-Type: application/json" \
-H "Authorization: Bearer token123" \
-d '{"name":"John","email":"john@example.com"}'`;

  const convertCurlToFetch = () => {
    try {
      const input = curlInput.trim();

      if (!input.startsWith("curl")) {
        setFetchOutput("Invalid curl command");
        return;
      }

      const urlMatch = input.match(/https?:\/\/[^\s"']+/);
      const url = urlMatch ? urlMatch[0] : "";

      const methodMatch = input.match(/-X\s+([A-Z]+)/i);
      const method = methodMatch ? methodMatch[1].toUpperCase() : "GET";

      const headers: Record<string, string> = {};
      const headerMatches =
        input.match(/-H\s+["']([^"']+)["']/g) || [];

      headerMatches.forEach((header) => {
        const cleaned = header.replace(/-H\s+["']/, "").replace(/["']$/, "");
        const parts = cleaned.split(":");

        if (parts.length >= 2) {
          const key = parts[0].trim();
          const value = parts.slice(1).join(":").trim();
          headers[key] = value;
        }
      });

      const bodyMatch =
        input.match(/-d\s+'([^']+)'/) ||
        input.match(/-d\s+"([^"]+)"/);

      const body = bodyMatch ? bodyMatch[1] : "";

      let result = `fetch("${url}", {\n`;
      result += `  method: "${method}"`;

      if (Object.keys(headers).length > 0) {
        result += `,\n  headers: ${JSON.stringify(headers, null, 4)}`;
      }

      if (body) {
        result += `,\n  body: ${JSON.stringify(body)}`;
      }

      result += `\n});`;

      setFetchOutput(result);
    } catch {
      setFetchOutput("Failed to parse curl command");
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
        <Button onClick={convertCurlToFetch}>
          Convert
        </Button>

        <Button variant="secondary" onClick={clearAll}>
          Clear
        </Button>
      </ToolActions>

      <ToolTextarea
        label="Fetch Output"
        value={fetchOutput}
        readOnly
        rows={10}
        rightLabel={
          <CopyButton value={fetchOutput} />
        }
      />
    </div>
  );
}
