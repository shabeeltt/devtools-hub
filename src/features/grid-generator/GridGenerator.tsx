import { useMemo, useState } from "react";
import CopyButton from "../../ui/CopyButton";

export default function GridGenerator() {
  const [columns, setColumns] = useState("repeat(3, 1fr)");
  const [rows, setRows] = useState("auto");
  const [gap, setGap] = useState("16px");
  const [justifyItems, setJustifyItems] = useState("center");
  const [alignItems, setAlignItems] = useState("center");

  const cssOutput = useMemo(() => {
    return `display: grid;\ngrid-template-columns: ${columns};\ngrid-template-rows: ${rows};\ngap: ${gap};\njustify-items: ${justifyItems};\nalign-items: ${alignItems};`;
  }, [columns, rows, gap, justifyItems, alignItems]);

  const previewStyles = useMemo(() => ({
    display: "grid",
    gridTemplateColumns: columns as React.CSSProperties["gridTemplateColumns"],
    gridTemplateRows: rows as React.CSSProperties["gridTemplateRows"],
    gap,
    justifyItems: justifyItems as React.CSSProperties["justifyItems"],
    alignItems: alignItems as React.CSSProperties["alignItems"],
    padding: "1rem",
    minHeight: "220px",
    backgroundColor: "rgba(99, 102, 241, 0.04)",
    borderRadius: "0.75rem",
  }), [columns, rows, gap, justifyItems, alignItems]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Grid Template Columns</label>
          <input
            value={columns}
            onChange={(e) => setColumns(e.target.value)}
            placeholder="repeat(3, 1fr)"
            className="w-full rounded-xl border border-border bg-surface p-3"
          />
          <p className="mt-2 text-xs text-secondary">Examples: <code>repeat(3, 1fr)</code>, <code>200px 1fr</code></p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Grid Template Rows</label>
          <input
            value={rows}
            onChange={(e) => setRows(e.target.value)}
            placeholder="auto"
            className="w-full rounded-xl border border-border bg-surface p-3"
          />
          <p className="mt-2 text-xs text-secondary">Examples: <code>auto</code>, <code>100px 1fr</code></p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Gap</label>
          <input
            value={gap}
            onChange={(e) => setGap(e.target.value)}
            placeholder="16px"
            className="w-full rounded-xl border border-border bg-surface p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Justify Items</label>
          <select
            value={justifyItems}
            onChange={(e) => setJustifyItems(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface p-3"
          >
            <option value="start">start</option>
            <option value="center">center</option>
            <option value="end">end</option>
            <option value="stretch">stretch</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Align Items</label>
          <select
            value={alignItems}
            onChange={(e) => setAlignItems(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface p-3"
          >
            <option value="start">start</option>
            <option value="center">center</option>
            <option value="end">end</option>
            <option value="stretch">stretch</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium">Generated CSS</p>
          <CopyButton value={cssOutput} />
        </div>

        <pre className="overflow-auto rounded-xl bg-background p-4 text-sm">
          {cssOutput}
        </pre>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium">Live Preview</p>
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-secondary">{columns} • {rows} • gap {gap}</span>
        </div>

        <div className="rounded-3xl border border-border p-4">
          <div style={previewStyles}>
            <div className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary">1</div>
            <div className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary">2</div>
            <div className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary">3</div>
            <div className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary">4</div>
            <div className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary">5</div>
            <div className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary">6</div>
          </div>
        </div>
      </div>
    </div>
  );
}
