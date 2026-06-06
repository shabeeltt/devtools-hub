import { useState } from "react";
import ToolTextarea from "../../components/tool/ToolTextarea";
import ToolActions from "../../components/tool/ToolActions";
import SampleButton from "../../ui/SampleButton";
import Button from "../../ui/Button";

const SAMPLE_HTML = `<div>
  <h1>Hello DevToolsHub</h1>
  <p>This is a live HTML preview.</p>
  <button>Click Me</button>
</div>`;

export default function HtmlLivePreview() {
  const [input, setInput] = useState("");

  const hasInput = input.trim().length > 0;

  function loadSample() {
    setInput(SAMPLE_HTML);
  }

  function clear() {
    setInput("");
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <ToolTextarea
          label="HTML Input"
          value={input}
          onChange={setInput}
          placeholder="Paste HTML here..."
          rows={18}
          rightLabel={<SampleButton onClick={loadSample} />}
        />

        <div className="space-y-2">
          <label className="text-sm text-secondary">
            Live Preview
          </label>

          <div className="h-[430px] overflow-hidden rounded-xl border border-border bg-surface">
  {hasInput ? (
    <iframe
      title="HTML Preview"
      sandbox=""
      srcDoc={input}
      className="h-full w-full border-0"
    />
  ) : (
    <div className="flex h-full items-center justify-center text-muted">
      Preview will appear here
    </div>
  )}
</div>
        </div>
      </div>

      <ToolActions>
        <Button
          variant="secondary"
          onClick={clear}
          isDisabled={!hasInput}
        >
          Clear
        </Button>
      </ToolActions>
    </div>
  );
}