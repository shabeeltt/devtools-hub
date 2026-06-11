import { useState, useMemo, useEffect } from "react";
import Button from "../../ui/Button";
import CopyButton from "../../ui/CopyButton";
import ToolActions from "../../components/tool/ToolActions";

type ColorStop = { color: string; pos: number };

// ── Color Conversion Helpers ───────────────────────────────────────────────────

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let hStr = hex.replace("#", "");
  if (hStr.length === 3) {
    hStr = hStr[0] + hStr[0] + hStr[1] + hStr[1] + hStr[2] + hStr[2];
  }
  const r = parseInt(hStr.slice(0, 2), 16) / 255;
  const g = parseInt(hStr.slice(2, 4), 16) / 255;
  const b = parseInt(hStr.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function hslToHex(h: number, s: number, l: number): string {
  const hue = ((h % 360) + 360) % 360;
  const sat = Math.max(0, Math.min(100, s)) / 100;
  const light = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = light - c / 2;
  let r = 0, g = 0, b = 0;
  if (hue < 60) { r = c; g = x; }
  else if (hue < 120) { r = x; g = c; }
  else if (hue < 180) { g = c; b = x; }
  else if (hue < 240) { g = x; b = c; }
  else if (hue < 300) { r = x; b = c; }
  else { r = c; b = x; }
  
  const toHexStr = (v: number) => {
    const val = Math.max(0, Math.min(255, Math.round((v + m) * 255)));
    const hex = val.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHexStr(r)}${toHexStr(g)}${toHexStr(b)}`.toUpperCase();
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let hStr = hex.replace("#", "");
  if (hStr.length === 3) {
    hStr = hStr[0] + hStr[0] + hStr[1] + hStr[1] + hStr[2] + hStr[2];
  }
  return {
    r: parseInt(hStr.slice(0, 2), 16),
    g: parseInt(hStr.slice(2, 4), 16),
    b: parseInt(hStr.slice(4, 6), 16),
  };
}

function randomHexColor(): string {
  const hex = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
  return `#${hex}`.toUpperCase();
}

// ── Harmony Generation ─────────────────────────────────────────────────────────

function generateHarmony(hex: string, mode: string, lockedColors?: string[], locked?: boolean[]): string[] {
  const { h, s, l } = hexToHsl(hex);
  const colors: string[] = [];

  switch (mode) {
    case "analogous":
      colors.push(hslToHex(h - 30, s, l));
      colors.push(hslToHex(h - 15, s, l));
      colors.push(hex);
      colors.push(hslToHex(h + 15, s, l));
      colors.push(hslToHex(h + 30, s, l));
      break;
    case "monochromatic":
      colors.push(hslToHex(h, s, Math.max(15, l - 30)));
      colors.push(hslToHex(h, s, Math.max(25, l - 15)));
      colors.push(hex);
      colors.push(hslToHex(h, Math.max(20, s - 10), Math.min(85, l + 15)));
      colors.push(hslToHex(h, Math.max(15, s - 20), Math.min(95, l + 30)));
      break;
    case "complementary":
      colors.push(hex);
      colors.push(hslToHex(h, s, Math.max(20, l - 15)));
      colors.push(hslToHex((h + 180) % 360, s, l));
      colors.push(hslToHex((h + 180) % 360, s, Math.max(20, l - 15)));
      colors.push(hslToHex((h + 180) % 360, Math.max(10, s - 15), Math.min(85, l + 15)));
      break;
    case "triadic":
      colors.push(hex);
      colors.push(hslToHex((h + 120) % 360, s, l));
      colors.push(hslToHex((h + 240) % 360, s, l));
      colors.push(hslToHex(h, s, Math.max(20, l - 20)));
      colors.push(hslToHex((h + 120) % 360, s, Math.max(20, l - 20)));
      break;
    case "split-complementary":
      colors.push(hex);
      colors.push(hslToHex((h + 150) % 360, s, l));
      colors.push(hslToHex((h + 210) % 360, s, l));
      colors.push(hslToHex(h, s, Math.max(20, l - 15)));
      colors.push(hslToHex((h + 150) % 360, s, Math.max(20, l - 15)));
      break;
    case "tetradic":
      colors.push(hex);
      colors.push(hslToHex((h + 90) % 360, s, l));
      colors.push(hslToHex((h + 180) % 360, s, l));
      colors.push(hslToHex((h + 270) % 360, s, l));
      colors.push(hslToHex(h, s, Math.max(20, l - 20)));
      break;
    case "random":
      for (let i = 0; i < 5; i++) {
        if (locked && locked[i] && lockedColors) {
          colors.push(lockedColors[i]);
        } else {
          colors.push(randomHexColor());
        }
      }
      break;
    default:
      colors.push(hex);
      break;
  }
  return colors;
}

export default function ColorPaletteGenerator() {
  const [activeTab, setActiveTab] = useState<"palette" | "gradient">("palette");

  // ── Palette Generator States ────────────────────────────────────────────────
  const [seedColor, setSeedColor] = useState("#3B82F6");
  const [harmonyMode, setHarmonyMode] = useState("analogous");
  const [locked, setLocked] = useState<boolean[]>([false, false, false, false, false]);
  const [paletteColors, setPaletteColors] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<"css" | "tailwind" | "json" | "hex">("css");

  // Generate palette
  const generateNewPalette = (seed: string, mode: string, forceRandom: boolean = false) => {
    let finalSeed = seed;
    if (forceRandom && mode !== "random") {
      finalSeed = randomHexColor();
      setSeedColor(finalSeed);
    }
    const computed = generateHarmony(finalSeed, mode, paletteColors, locked);
    setPaletteColors(computed);
  };

  // Trigger palette calculation on seed or harmony change
  useEffect(() => {
    if (harmonyMode !== "random") {
      generateNewPalette(seedColor, harmonyMode);
    }
  }, [seedColor, harmonyMode]);

  // Initial generation
  useEffect(() => {
    generateNewPalette(seedColor, harmonyMode);
  }, []);

  // Listen to space bar for palette generation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab === "palette" && e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        generateNewPalette(seedColor, harmonyMode, true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, seedColor, harmonyMode, locked, paletteColors]);

  const toggleLock = (index: number) => {
    setLocked((prev) => prev.map((l, i) => (i === index ? !l : l)));
  };

  const handleSwatchColorChange = (index: number, newColor: string) => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(newColor)) return;
    setPaletteColors((prev) => prev.map((c, i) => (i === index ? newColor.toUpperCase() : c)));
    if (index === 2 && harmonyMode !== "random") {
      setSeedColor(newColor.toUpperCase());
    }
  };

  // Palette Exports
  const paletteExportString = useMemo(() => {
    if (paletteColors.length === 0) return "";
    switch (exportFormat) {
      case "css":
        return `:root {\n${paletteColors
          .map((color, i) => `  --color-palette-${i + 1}: ${color};`)
          .join("\n")}\n}`;
      case "tailwind":
        return `colors: {\n  palette: {\n${paletteColors
          .map((color, i) => `    ${i + 1}: "${color}",`)
          .join("\n")}\n  }\n}`;
      case "json":
        return JSON.stringify(paletteColors, null, 2);
      case "hex":
        return paletteColors.join(", ");
    }
  }, [paletteColors, exportFormat]);

  // ── Gradient Generator States ───────────────────────────────────────────────
  const [gradType, setGradType] = useState<"linear" | "radial">("linear");
  const [gradAngle, setGradAngle] = useState(90);
  const [gradStops, setGradStops] = useState<ColorStop[]>([
    { color: "#3B82F6", pos: 0 },
    { color: "#8B5CF6", pos: 50 },
    { color: "#EC4899", pos: 100 },
  ]);

  const updateStop = (index: number, patch: Partial<ColorStop>) => {
    setGradStops((stops) =>
      stops.map((st, i) => (i === index ? { ...st, ...patch } : st))
    );
  };

  const addStop = () => {
    const lastStop = gradStops[gradStops.length - 1];
    const newPos = lastStop ? Math.min(100, lastStop.pos + 15) : 50;
    setGradStops((stops) => [...stops, { color: randomHexColor(), pos: newPos }]);
  };

  const removeStop = (index: number) => {
    if (gradStops.length <= 2) return; // Maintain at least 2 stops
    setGradStops((stops) => stops.filter((_, i) => i !== index));
  };

  const randomizeGradient = () => {
    setGradStops((stops) =>
      stops
        .map(() => ({ color: randomHexColor(), pos: Math.floor(Math.random() * 101) }))
        .sort((a, b) => a.pos - b.pos)
    );
  };

  const gradientCSSValue = useMemo(() => {
    const stopsStr = gradStops
      .slice()
      .sort((a, b) => a.pos - b.pos)
      .map((st) => `${st.color} ${st.pos}%`)
      .join(", ");

    return gradType === "linear"
      ? `linear-gradient(${gradAngle}deg, ${stopsStr})`
      : `radial-gradient(circle, ${stopsStr})`;
  }, [gradType, gradAngle, gradStops]);

  const cssGradientOutput = `background: ${gradientCSSValue};`;

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-border pb-px">
        <button
          onClick={() => setActiveTab("palette")}
          className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px text-sm ${
            activeTab === "palette"
              ? "border-accent text-accent font-semibold"
              : "border-transparent text-secondary hover:text-primary"
          }`}
        >
          Color Palette Generator
        </button>
        <button
          onClick={() => setActiveTab("gradient")}
          className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px text-sm ${
            activeTab === "gradient"
              ? "border-accent text-accent font-semibold"
              : "border-transparent text-secondary hover:text-primary"
          }`}
        >
          CSS Gradient Generator
        </button>
      </div>

      {/* ── TAB 1: Palette Generator ───────────────────────────────────────────── */}
      {activeTab === "palette" && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Control Panel */}
            <div className="space-y-4 rounded-xl border border-border bg-surface p-5 md:col-span-1">
              <div>
                <label className="mb-2 block text-sm font-medium text-primary">Seed Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={seedColor}
                    onChange={(e) => setSeedColor(e.target.value.toUpperCase())}
                    className="h-10 w-12 cursor-pointer rounded-lg border border-border bg-background"
                  />
                  <input
                    type="text"
                    value={seedColor}
                    onChange={(e) => setSeedColor(e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-sm text-primary uppercase focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-primary">Harmony Scheme</label>
                <select
                  value={harmonyMode}
                  onChange={(e) => setHarmonyMode(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background p-2 text-sm text-primary focus:outline-none focus:border-accent"
                >
                  <option value="analogous">Analogous</option>
                  <option value="monochromatic">Monochromatic</option>
                  <option value="complementary">Complementary</option>
                  <option value="triadic">Triadic</option>
                  <option value="split-complementary">Split-Complementary</option>
                  <option value="tetradic">Tetradic</option>
                  <option value="random">Random Palette</option>
                </select>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => generateNewPalette(seedColor, harmonyMode, true)}
                  className="w-full"
                  variant="primary"
                >
                  Generate Palette
                </Button>
                <p className="mt-2 text-center text-xs text-muted">
                  Tip: Press <kbd className="rounded bg-elevated px-1 font-mono text-secondary">Space</kbd> on your keyboard to randomize
                </p>
              </div>
            </div>

            {/* Swatches Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 md:col-span-2">
              {paletteColors.map((color, index) => {
                const rgb = hexToRgb(color);
                const hsl = hexToHsl(color);
                const isLight = hsl.l > 65;

                return (
                  <div
                    key={index}
                    className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:shadow-md"
                  >
                    {/* Visual Swatch */}
                    <div
                      className="group relative flex h-36 w-full items-end justify-center p-3 transition-colors cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setSeedColor(color);
                        if (harmonyMode === "random") {
                          setHarmonyMode("analogous"); // Switch to analogous when clicking to seed
                        }
                      }}
                      title="Set as seed color"
                    >
                      {/* Seed marker */}
                      {seedColor === color && harmonyMode !== "random" && (
                        <span className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isLight ? "bg-black/10 text-black/80" : "bg-white/20 text-white"
                        }`}>
                          Seed
                        </span>
                      )}

                      {/* Lock Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLock(index);
                        }}
                        className={`rounded-full p-2 transition-all opacity-80 hover:opacity-100 ${
                          locked[index] ? "scale-110" : "scale-100"
                        } ${
                          isLight ? "bg-black/10 text-black" : "bg-white/20 text-white"
                        }`}
                      >
                        {locked[index] ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
                        )}
                      </button>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => handleSwatchColorChange(index, e.target.value)}
                          className="w-full text-center font-mono text-sm font-bold text-primary uppercase bg-transparent border-b border-transparent hover:border-border focus:border-accent focus:outline-none"
                        />
                        <div className="text-[10px] font-mono text-muted text-center space-y-0.5">
                          <p>RGB({rgb.r},{rgb.g},{rgb.b})</p>
                          <p>HSL({hsl.h}°,{hsl.s}%,{hsl.l}%)</p>
                        </div>
                      </div>

                      <div className="flex gap-1.5 justify-center">
                        <button
                          onClick={() => setSeedColor(color)}
                          className="p-1 text-secondary hover:text-primary rounded bg-elevated hover:bg-border transition-colors"
                          title="Set as base color"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                        </button>
                        <CopyButton
                          value={color}
                          className="flex-1 text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Export Box */}
          <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-sm font-medium text-primary">Export Color Scheme</h3>
                <p className="text-xs text-secondary">Export code formats for your projects.</p>
              </div>

              <div className="flex flex-wrap gap-1">
                {(["css", "tailwind", "json", "hex"] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => setExportFormat(format)}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold uppercase transition-colors ${
                      exportFormat === format
                        ? "bg-accent text-white"
                        : "bg-elevated text-secondary hover:bg-border hover:text-primary"
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <pre className="overflow-auto rounded-xl bg-background p-4 text-xs font-mono text-secondary max-h-48 custom-scrollbar">
                {paletteExportString}
              </pre>
              <CopyButton
                value={paletteExportString}
                className="absolute right-3 top-3 text-xs bg-surface"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: Gradient Generator ──────────────────────────────────────────── */}
      {activeTab === "gradient" && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Control Panel */}
            <div className="space-y-5 rounded-xl border border-border bg-surface p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-primary">Gradient Type</label>
                  <select
                    value={gradType}
                    onChange={(e) => setGradType(e.target.value as any)}
                    className="w-full rounded-lg border border-border bg-background p-2.5 text-sm text-primary focus:outline-none focus:border-accent"
                  >
                    <option value="linear">Linear</option>
                    <option value="radial">Radial</option>
                  </select>
                </div>

                {gradType === "linear" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-primary">Angle: {gradAngle}°</label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={gradAngle}
                      onChange={(e) => setGradAngle(Number(e.target.value))}
                      className="w-full h-8 accent-accent"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <label className="block text-sm font-medium text-primary">Color Stops</label>
                  <div className="flex gap-2">
                    <button
                      onClick={addStop}
                      className="rounded bg-elevated hover:bg-border px-3 py-1.5 text-xs text-primary font-semibold transition-colors"
                    >
                      Add Stop
                    </button>
                    <button
                      onClick={randomizeGradient}
                      className="rounded bg-elevated hover:bg-border px-3 py-1.5 text-xs text-primary font-semibold transition-colors"
                    >
                      Randomize
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                  {gradStops.map((st, i) => (
                    <div key={i} className="flex gap-2 items-center bg-background/50 rounded-lg p-2 border border-border/50">
                      <input
                        type="color"
                        value={st.color}
                        onChange={(e) => updateStop(i, { color: e.target.value.toUpperCase() })}
                        className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent"
                      />
                      <input
                        type="text"
                        value={st.color}
                        onChange={(e) => updateStop(i, { color: e.target.value })}
                        className="rounded border border-border bg-background px-2 py-1 font-mono text-xs w-24 uppercase focus:outline-none focus:border-accent"
                      />
                      
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-[10px] text-secondary w-6 text-right font-mono">{st.pos}%</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={st.pos}
                          onChange={(e) => updateStop(i, { pos: Number(e.target.value) })}
                          className="flex-1 h-2 accent-accent bg-border rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <button
                        onClick={() => removeStop(i)}
                        disabled={gradStops.length <= 2}
                        className="p-1.5 text-secondary hover:text-danger hover:bg-danger-bg rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete stop"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="space-y-4 flex flex-col justify-between">
              {/* Live Preview Display */}
              <div className="rounded-xl border border-border bg-surface p-5 flex-1 flex flex-col min-h-[220px]">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-primary">Live Gradient Preview</p>
                  <span className="rounded-full bg-elevated border border-border px-3 py-0.5 text-xs text-secondary capitalize">
                    {gradType} • stops {gradStops.length}
                  </span>
                </div>

                <div className="flex-1 rounded-xl border border-border overflow-hidden min-h-[140px] relative shadow-inner">
                  <div
                    className="absolute inset-0 transition-all duration-300"
                    style={{ background: gradientCSSValue }}
                  />
                </div>
              </div>

              {/* Code output */}
              <div className="rounded-xl border border-border bg-surface p-5">
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-primary">Generated CSS Code</p>
                  <CopyButton value={cssGradientOutput} />
                </div>

                <pre className="overflow-auto rounded-lg bg-background p-3 text-xs font-mono text-secondary border border-border/50 max-h-24">
                  {cssGradientOutput}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
