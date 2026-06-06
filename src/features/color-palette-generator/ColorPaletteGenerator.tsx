import { useMemo, useState } from "react";
import CopyButton from "../../ui/CopyButton";

type ColorStop = { color: string; pos: number };

export default function ColorPaletteGenerator() {
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState("90deg");
  const [stops, setStops] = useState<ColorStop[]>([
    { color: "#2563EB", pos: 0 },
    { color: "#7C3AED", pos: 50 },
    { color: "#EC4899", pos: 100 },
  ]);

  function updateStop(index: number, patch: Partial<ColorStop>) {
    setStops((s) => s.map((st, i) => (i === index ? { ...st, ...patch } : st)));
  }

  function addStop() {
    setStops((s) => [...s, { color: "#000000", pos: 100 }]);
  }

  function removeStop(index: number) {
    setStops((s) => s.filter((_, i) => i !== index));
  }

  function randomHex() {
    return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0")}`;
  }

  function randomize() {
    setStops((s) => s.map(() => ({ color: randomHex(), pos: Math.floor(Math.random() * 101) })).sort((a,b)=>a.pos-b.pos));
  }

  const gradientValue = useMemo(() => {
    const stopsStr = stops
      .slice()
      .sort((a, b) => a.pos - b.pos)
      .map((st) => `${st.color} ${st.pos}%`)
      .join(", ");

    if (type === "linear") {
      return `linear-gradient(${angle}, ${stopsStr})`;
    }

    return `radial-gradient(circle, ${stopsStr})`;
  }, [type, angle, stops]);

  const cssOutput = `background: ${gradientValue};`;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Gradient Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full rounded-xl border border-border bg-surface p-3">
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>
        </div>

        {type === "linear" && (
          <div>
            <label className="mb-2 block text-sm font-medium">Angle</label>
            <input value={angle} onChange={(e) => setAngle(e.target.value)} placeholder="90deg" className="w-full rounded-xl border border-border bg-surface p-3" />
          </div>
        )}

        <div className="sm:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium">Color Stops</label>
            <div className="flex gap-2">
              <button onClick={addStop} className="rounded bg-surface px-3 py-1 text-xs hover:bg-elevated">Add</button>
              <button onClick={randomize} className="rounded bg-surface px-3 py-1 text-xs hover:bg-elevated">Random</button>
            </div>
          </div>

          <div className="space-y-3">
            {stops.map((st, i) => (
              <div key={i} className="flex gap-2">
                <input value={st.color} onChange={(e) => updateStop(i, { color: e.target.value })} className="rounded-xl border border-border bg-surface p-3 w-32" />
                <input type="number" value={st.pos} onChange={(e) => updateStop(i, { pos: Number(e.target.value) })} className="rounded-xl border border-border bg-surface p-3 w-24" />
                <button onClick={() => removeStop(i)} className="rounded bg-surface px-3 py-1 text-xs hover:bg-elevated">Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium">Generated CSS</p>
          <CopyButton value={cssOutput} />
        </div>

        <pre className="overflow-auto rounded-xl bg-background p-4 text-sm">{cssOutput}</pre>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium">Live Preview</p>
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-secondary">{type} • stops {stops.length}</span>
        </div>

        <div className="rounded-3xl border border-border p-4">
          <div style={{ background: gradientValue, minHeight: 180, borderRadius: 12 }} />
        </div>
      </div>
    </div>
  );
}
