import { useState } from "react";
import ToolActions from "../../components/tool/ToolActions";
import Button from "../../ui/Button";
import CopyButton from "../../ui/CopyButton";

const UNITS = ["px", "em", "rem", "%", "vw", "vh"];

const BASE_FONT_SIZE = 16;
const VIEWPORT_WIDTH = 1920;
const VIEWPORT_HEIGHT = 1080;

function toPx(value: number, unit: string): number {
  switch (unit) {
    case "px":
      return value;
    case "em":
    case "rem":
      return value * BASE_FONT_SIZE;
    case "%":
      return (value / 100) * BASE_FONT_SIZE;
    case "vw":
      return (value / 100) * VIEWPORT_WIDTH;
    case "vh":
      return (value / 100) * VIEWPORT_HEIGHT;
    default:
      return value;
  }
}

function fromPx(value: number, unit: string): number {
  switch (unit) {
    case "px":
      return value;
    case "em":
    case "rem":
      return value / BASE_FONT_SIZE;
    case "%":
      return (value / BASE_FONT_SIZE) * 100;
    case "vw":
      return (value / VIEWPORT_WIDTH) * 100;
    case "vh":
      return (value / VIEWPORT_HEIGHT) * 100;
    default:
      return value;
  }
}

export default function CssUnitConverter() {
  const [value, setValue] = useState("16");
  const [fromUnit, setFromUnit] = useState("px");
  const [toUnit, setToUnit] = useState("rem");

  const numericValue = parseFloat(value);

  const result = !isNaN(numericValue)
    ? fromPx(toPx(numericValue, fromUnit), toUnit).toFixed(4)
    : "";

  function swapUnits() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  function clear() {
    setValue("");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-surface p-4 space-y-4">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value"
          className="w-full rounded-lg border border-border bg-background p-3"
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="rounded-lg border border-border bg-background p-3"
          >
            {UNITS.map((unit) => (
              <option key={unit}>{unit}</option>
            ))}
          </select>

          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="rounded-lg border border-border bg-background p-3"
          >
            {UNITS.map((unit) => (
              <option key={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <ToolActions>
          <Button variant="primary" onClick={swapUnits}>
            Swap
          </Button>

          <Button variant="secondary" onClick={clear}>
            Clear
          </Button>
        </ToolActions>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-secondary">Result</p>
            <p className="font-mono text-lg">
              {result} {toUnit}
            </p>
          </div>

          {result && <CopyButton value={`${result} ${toUnit}`} />}
        </div>
      </div>

      <div className="text-xs text-muted">
        Assumptions: 1rem = 16px, 1em = 16px, viewport = 1920×1080.
      </div>
    </div>
  );
}