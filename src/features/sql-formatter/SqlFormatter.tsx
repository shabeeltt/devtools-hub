import { useState } from "react";
import ToolTextarea from "../../components/tool/ToolTextarea";
import ToolActions from "../../components/tool/ToolActions";
import CopyButton from "../../ui/CopyButton";
import SampleButton from "../../ui/SampleButton";
import Button from "../../ui/Button";

const SAMPLE_SQL =
  "select id,name,email from users where active=1 order by created_at desc";

function formatSql(sql: string): string {
  return sql
    .replace(/\s+/g, " ")
    .replace(/\bselect\b/gi, "SELECT")
    .replace(/\bfrom\b/gi, "\nFROM")
    .replace(/\bwhere\b/gi, "\nWHERE")
    .replace(/\binner join\b/gi, "\nINNER JOIN")
    .replace(/\bleft join\b/gi, "\nLEFT JOIN")
    .replace(/\bright join\b/gi, "\nRIGHT JOIN")
    .replace(/\bjoin\b/gi, "\nJOIN")
    .replace(/\bgroup by\b/gi, "\nGROUP BY")
    .replace(/\border by\b/gi, "\nORDER BY")
    .replace(/\bhaving\b/gi, "\nHAVING")
    .replace(/\blimit\b/gi, "\nLIMIT")
    .trim();
}

export default function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const hasInput = input.trim().length > 0;
  const canUseOutput = output.length > 0;

  function handleFormat() {
    setOutput(formatSql(input));
  }

  function loadSample() {
    setInput(SAMPLE_SQL);
    setOutput(formatSql(SAMPLE_SQL));
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
          placeholder="Paste SQL query here..."
          rows={15}
          rightLabel={<SampleButton onClick={loadSample} />}
        />

        <ToolTextarea
  label="Output"
  value={output}
  readOnly
  rows={15}
  textColor="accent"
  rightLabel={
    canUseOutput ? <CopyButton value={output} /> : undefined
  }
/>
      </div>

      <div className="md:hidden sticky bottom-4 z-10 bg-surface/95 backdrop-blur-sm border border-border rounded-xl p-3 shadow-lg">
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={handleFormat}
            isDisabled={!hasInput}
            className="flex-1"
          >
            Format SQL
          </Button>

          {output && (
            <Button variant="secondary" onClick={clear}>
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="hidden md:block">
        <ToolActions>
          <Button
            variant="primary"
            onClick={handleFormat}
            isDisabled={!hasInput}
          >
            Format SQL
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