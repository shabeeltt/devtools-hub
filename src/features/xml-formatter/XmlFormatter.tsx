import { useState } from "react";
import ToolTextarea from "../../components/tool/ToolTextarea";
import ToolActions from "../../components/tool/ToolActions";
import CopyButton from "../../ui/CopyButton";
import SampleButton from "../../ui/SampleButton";
import Button from "../../ui/Button";

const SAMPLE_XML =
  '<root><user><name>DevToolsHub</name><role>Developer</role></user></root>';

function formatXml(xml: string): string {
  const formatted: string[] = [];
  const reg = /(>)(<)(\/*)/g;

  xml = xml.replace(reg, "$1\r\n$2$3");

  let pad = 0;

  xml.split("\r\n").forEach((node) => {
    let indent = 0;

    if (node.match(/^<\/\w/)) {
      if (pad > 0) {
        pad -= 1;
      }
    } else if (
      node.match(/^<\w[^>]*[^/]>/) &&
      !node.includes("</")
    ) {
      indent = 1;
    }

    formatted.push("  ".repeat(pad) + node);
    pad += indent;
  });

  return formatted.join("\n");
}

export default function XmlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const hasInput = input.trim().length > 0;
  const canUseOutput = output.length > 0 && output !== "Invalid XML format";

  function handleFormat() {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, "application/xml");

      if (xmlDoc.querySelector("parsererror")) {
        throw new Error();
      }

      setOutput(formatXml(input));
    } catch {
      setOutput("Invalid XML format");
    }
  }

  function loadSample() {
    setInput(SAMPLE_XML);
    setOutput(formatXml(SAMPLE_XML));
  }

  function clear() {
    setInput("");
    setOutput("");
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <ToolTextarea
          label="Input"
          value={input}
          onChange={setInput}
          placeholder="Paste XML here..."
          rows={15}
          rightLabel={<SampleButton onClick={loadSample} />}
        />

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

      <div className="hidden md:block">
        <ToolActions>
          <Button
            variant="primary"
            onClick={handleFormat}
            isDisabled={!hasInput}
          >
            Format XML
          </Button>

          {output && (
            <Button variant="secondary" onClick={clear}>
              Clear
            </Button>
          )}
        </ToolActions>
      </div>
    </div>
  );
}