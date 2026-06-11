import { useState, type ChangeEvent } from "react";
import CopyButton from "../../ui/CopyButton";

const PRESET_RADII = [
  "0px",
  "4px",
  "8px",
  "12px",
  "16px",
  "20px",
  "24px",
  "32px",
  "9999px",
] as const;

const BorderRadiusGenerator = () => {
  const [radius, setRadius] = useState<string>("16px");
  const [customRadius, setCustomRadius] = useState("16px");

  const cssOutput = `border-radius: ${radius};`;

  const updateRadius = (nextRadius: string) => {
    setRadius(nextRadius);
    setCustomRadius(nextRadius);
  };

  const handlePresetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    updateRadius(event.target.value);
  };

  const handleCustomChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setCustomRadius(next);
    setRadius(next);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border p-6 shadow-sm">
        <div className="mb-4 text-sm text-muted">
          Use the controls below to generate a border radius value.
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-foreground">Preset radius</span>
            <select
              value={radius}
              onChange={handlePresetChange}
              className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              {PRESET_RADII.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-foreground">Custom radius</span>
            <input
              type="text"
              value={customRadius}
              onChange={handleCustomChange}
              placeholder="12px, 50%, 1rem"
              className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background p-4 text-sm text-foreground">
            <div className="font-medium text-foreground">Live preview</div>
            <div
              className="mt-3 h-28 rounded-xl border border-border bg-muted"
              style={{ borderRadius: radius }}
            />
          </div>

          <div className="rounded-2xl border border-border bg-background p-4 text-sm text-foreground">
            <div className="font-medium text-foreground">CSS output</div>
            <div className="relative mt-2">
              <pre className="overflow-x-auto rounded-xl border border-border bg-surface p-4 text-sm text-foreground">
                {cssOutput}
              </pre>
              <CopyButton value={cssOutput} className="absolute right-3 top-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorderRadiusGenerator;
