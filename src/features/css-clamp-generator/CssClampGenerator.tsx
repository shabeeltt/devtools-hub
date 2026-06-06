import { useState } from "react";
import CopyButton from "../../ui/CopyButton";

export default function CssClampGenerator() {
  const [property, setProperty] = useState("font-size");
  const [min, setMin] = useState("1rem");
  const [preferred, setPreferred] = useState("2vw");
  const [max, setMax] = useState("2rem");

  const clampValue = `clamp(${min}, ${preferred}, ${max})`;
  const cssOutput = `${property}: ${clampValue};`;

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            CSS Property
          </label>

          <select
            value={property}
            onChange={(e) => setProperty(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface p-3"
          >
            <option value="font-size">font-size</option>
            <option value="width">width</option>
            <option value="height">height</option>
            <option value="padding">padding</option>
            <option value="margin">margin</option>
            <option value="gap">gap</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Minimum Value
          </label>

          <input
            value={min}
            placeholder="1rem"
            onChange={(e) => setMin(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Preferred Value
          </label>

          <input
            value={preferred}
            placeholder="2vw"
            onChange={(e) => setPreferred(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Maximum Value
          </label>

          <input
            value={max}
            placeholder="2rem"
            onChange={(e) => setMax(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface p-3"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <p className="mb-3 text-sm font-medium">
          Generated CSS
        </p>

        <div className="relative">
          <pre className="overflow-auto rounded-xl bg-background p-4 text-sm">
            {cssOutput}
          </pre>

          <CopyButton
            value={cssOutput}
            className="absolute right-2 top-2"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="mb-3 text-sm font-medium">
          Live Preview
        </p>

        <p
          style={{ [property]: clampValue } as React.CSSProperties}
          className="font-semibold"
        >
          Responsive Preview Text
        </p>
      </div>
    </div>
  );
}