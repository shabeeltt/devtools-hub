import { useState } from "react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  function formatJson() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch {
      setOutput("invalid json");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea
        className="rounded p-3 text-black"
        rows={10}
        placeholder="paste json here"
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />

      <button className="rounded bg-blue-500 px-4 py-2" onClick={formatJson}>
        format
      </button>

      <pre className="rounded bg-slate-800 p-4 whitespace-pre-wrap">
        {output}
      </pre>
    </div>
  );
}
