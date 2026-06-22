import { useState } from "react";
import CopyButton from "../../ui/CopyButton";
import ToolActions from "../../components/tool/ToolActions";
import Button from "../../ui/Button";

// ── Helper functions for parsing & cleaning ──────────────────────────────────

function getCleanValue(val: string, base: number): { cleaned: string; isNegative: boolean } {
  // Strip spaces, underscores, commas
  let trimmed = val.trim().replace(/_/g, "").replace(/,/g, "").replace(/\s+/g, "");
  const isNegative = trimmed.startsWith("-");
  if (isNegative) {
    trimmed = trimmed.slice(1);
  }
  if (base === 16) {
    if (trimmed.toLowerCase().startsWith("0x")) {
      trimmed = trimmed.slice(2);
    }
  } else if (base === 2) {
    if (trimmed.toLowerCase().startsWith("0b")) {
      trimmed = trimmed.slice(2);
    }
  } else if (base === 8) {
    if (trimmed.toLowerCase().startsWith("0o")) {
      trimmed = trimmed.slice(2);
    }
  }
  return { cleaned: trimmed, isNegative };
}

function isValidForBase(val: string, base: number): boolean {
  const { cleaned } = getCleanValue(val, base);
  if (cleaned === "") return true;

  switch (base) {
    case 10:
      return /^[0-9]+$/.test(cleaned);
    case 2:
      return /^[01]+$/.test(cleaned);
    case 16:
      return /^[0-9a-fA-F]+$/.test(cleaned);
    case 8:
      return /^[0-7]+$/.test(cleaned);
    default:
      return false;
  }
}

function parseBigInt(str: string, base: number): bigint | null {
  const { cleaned, isNegative } = getCleanValue(str, base);
  if (cleaned === "") return null;
  if (!isValidForBase(str, base)) return null;

  try {
    let result: bigint;
    if (base === 10) {
      result = BigInt(cleaned);
    } else if (base === 16) {
      result = BigInt("0x" + cleaned);
    } else if (base === 2) {
      result = BigInt("0b" + cleaned);
    } else if (base === 8) {
      result = BigInt("0o" + cleaned);
    } else {
      return null;
    }
    return isNegative ? -result : result;
  } catch {
    return null;
  }
}

// ── Helper functions for formatting ──────────────────────────────────────────

function formatDecimal(val: string, group: boolean): string {
  if (!group || val === "" || val === "-") return val;
  const isNeg = val.startsWith("-");
  const absVal = isNeg ? val.slice(1) : val;
  const formatted = absVal.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return isNeg ? "-" + formatted : formatted;
}

function formatBinary(val: string, group: boolean): string {
  if (!group || val === "" || val === "-") return val;
  const isNeg = val.startsWith("-");
  const absVal = isNeg ? val.slice(1) : val;
  const reversed = absVal.split("").reverse().join("");
  const chunked = reversed.match(/.{1,4}/g);
  if (!chunked) return val;
  const formatted = chunked.join(" ").split("").reverse().join("");
  return isNeg ? "-" + formatted : formatted;
}

function formatHex(val: string, group: boolean): string {
  if (!group || val === "" || val === "-") return val.toUpperCase();
  const isNeg = val.startsWith("-");
  const absVal = isNeg ? val.slice(1) : val;
  const reversed = absVal.split("").reverse().join("");
  const chunked = reversed.match(/.{1,2}/g);
  if (!chunked) return val.toUpperCase();
  const formatted = chunked.join(" ").split("").reverse().join("");
  return (isNeg ? "-" + formatted : formatted).toUpperCase();
}

function formatOctal(val: string, group: boolean): string {
  if (!group || val === "" || val === "-") return val;
  const isNeg = val.startsWith("-");
  const absVal = isNeg ? val.slice(1) : val;
  const reversed = absVal.split("").reverse().join("");
  const chunked = reversed.match(/.{1,3}/g);
  if (!chunked) return val;
  const formatted = chunked.join(" ").split("").reverse().join("");
  return isNeg ? "-" + formatted : formatted;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function NumberBaseConverter() {
  const [sourceValue, setSourceValue] = useState("");
  const [sourceBase, setSourceBase] = useState<number>(10);
  const [groupDigits, setGroupDigits] = useState(true);

  // Validate the active field value
  const isValid = isValidForBase(sourceValue, sourceBase);
  const parsedValue = isValid ? parseBigInt(sourceValue, sourceBase) : null;

  // Determine values to show in inputs
  function getDisplayValue(base: number): string {
    // If this is the active source field, display what the user is typing
    if (sourceBase === base) {
      return sourceValue;
    }

    // If source is empty, negative-only, or invalid, display empty
    if (!sourceValue || sourceValue === "-" || !isValid || parsedValue === null) {
      return "";
    }

    // Convert the parsed BigInt value to the target base
    const rawConverted = parsedValue.toString(base);

    // Apply grouping formatting
    switch (base) {
      case 10:
        return formatDecimal(rawConverted, groupDigits);
      case 2:
        return formatBinary(rawConverted, groupDigits);
      case 16:
        return formatHex(rawConverted, groupDigits);
      case 8:
        return formatOctal(rawConverted, groupDigits);
      default:
        return rawConverted;
    }
  }

  // Get validation error message if the current source field has invalid input
  function getValidationError(base: number): string | null {
    if (sourceBase !== base || isValid || !sourceValue) {
      return null;
    }

    switch (base) {
      case 10:
        return "Invalid decimal number. Only digits 0-9 are allowed.";
      case 2:
        return "Invalid binary number. Only 0 and 1 are allowed.";
      case 16:
        return "Invalid hexadecimal number. Only digits 0-9 and letters A-F are allowed.";
      case 8:
        return "Invalid octal number. Only digits 0-7 are allowed.";
      default:
        return "Invalid characters for this base.";
    }
  }

  function handleInputChange(val: string, base: number) {
    setSourceBase(base);
    setSourceValue(val);
  }

  function loadSample(val: string) {
    setSourceBase(10);
    setSourceValue(val);
  }

  function clear() {
    setSourceValue("");
  }

  const bases = [
    { base: 10, name: "Decimal", label: "Decimal (Base 10)", placeholder: "e.g. 255" },
    { base: 2, name: "Binary", label: "Binary (Base 2)", placeholder: "e.g. 11111111" },
    { base: 16, name: "Hexadecimal", label: "Hexadecimal (Base 16)", placeholder: "e.g. FF" },
    { base: 8, name: "Octal", label: "Octal (Base 8)", placeholder: "e.g. 377" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Options Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface/50 p-4">
        <label className="flex items-center gap-2.5 cursor-pointer group select-none">
          <input
            type="checkbox"
            checked={groupDigits}
            onChange={(e) => setGroupDigits(e.target.checked)}
            className="size-4 rounded border-border bg-elevated text-accent focus:ring-0 focus:ring-offset-0 transition-colors"
          />
          <span className="text-sm font-medium text-secondary group-hover:text-primary transition-colors">
            Group digits for readability
          </span>
        </label>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted font-medium mr-1 hidden sm:inline">Samples:</span>
          <button
            onClick={() => loadSample("255")}
            className="rounded-lg bg-elevated px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-border hover:text-primary transition-all active:scale-95"
          >
            255
          </button>
          <button
            onClick={() => loadSample("65535")}
            className="rounded-lg bg-elevated px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-border hover:text-primary transition-all active:scale-95"
          >
            65,535
          </button>
          <button
            onClick={() => loadSample("1048576")}
            className="rounded-lg bg-elevated px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-border hover:text-primary transition-all active:scale-95"
          >
            1,048,576
          </button>
        </div>
      </div>

      {/* Grid Layout of Input Fields */}
      <div className="grid gap-6 md:grid-cols-2">
        {bases.map(({ base, name, label, placeholder }) => {
          const displayVal = getDisplayValue(base);
          const errorMsg = getValidationError(base);
          const hasVal = displayVal.length > 0 && displayVal !== "-";

          return (
            <div key={base} className="space-y-2">
              <label className="text-sm font-semibold text-secondary">{label}</label>
              <div className="relative">
                <input
                  type="text"
                  value={displayVal}
                  placeholder={placeholder}
                  onChange={(e) => handleInputChange(e.target.value, base)}
                  className={`w-full rounded-xl border bg-surface p-4 pr-20 font-mono text-sm text-primary outline-none transition-all ${
                    errorMsg
                      ? "border-danger focus:border-danger/80 focus:ring-1 focus:ring-danger/20"
                      : "border-border focus:border-accent/50 focus:ring-1 focus:ring-accent/10"
                  }`}
                />
                {hasVal && !errorMsg && (
                  <CopyButton
                    value={displayVal}
                    className="absolute right-4 top-1/2 -translate-y-1/2 shadow-sm"
                  />
                )}
              </div>
              {errorMsg && (
                <p className="text-xs font-medium text-danger animate-in fade-in duration-200">
                  {errorMsg}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons & Note */}
      <ToolActions>
        <Button
          variant="secondary"
          onClick={clear}
          isDisabled={!sourceValue}
        >
          Clear
        </Button>
      </ToolActions>

      <div className="rounded-xl border border-border bg-surface/50 p-4 text-xs text-secondary leading-relaxed space-y-1.5">
        <p className="font-semibold text-primary">Features & Conversions:</p>
        <ul className="list-disc list-inside space-y-1 text-muted">
          <li>Supports base prefixes (e.g. typing <code className="font-mono text-secondary text-[11px] bg-elevated px-1 py-0.5 rounded">0x</code> in hexadecimal, <code className="font-mono text-secondary text-[11px] bg-elevated px-1 py-0.5 rounded">0b</code> in binary, or <code className="font-mono text-secondary text-[11px] bg-elevated px-1 py-0.5 rounded">0o</code> in octal).</li>
          <li>Arbitrary-precision integers using <code className="font-mono text-secondary">BigInt</code> (handles very large numbers without overflow).</li>
          <li>Supports negative values.</li>
          <li>Local-only real-time conversion in your browser. No data is sent to external servers.</li>
        </ul>
      </div>
    </div>
  );
}
