import { useState, useMemo } from "react";
import Button from "../../ui/Button";
import CopyButton from "../../ui/CopyButton";
import ToolActions from "../../components/tool/ToolActions";

interface Preset {
  name: string;
  keyframes: string;
}

const PRESETS: Record<string, Preset> = {
  fadeIn: {
    name: "Fade In",
    keyframes: `  from { opacity: 0; }
  to { opacity: 1; }`,
  },
  fadeOut: {
    name: "Fade Out",
    keyframes: `  from { opacity: 1; }
  to { opacity: 0; }`,
  },
  slideInLeft: {
    name: "Slide In Left",
    keyframes: `  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }`,
  },
  slideInRight: {
    name: "Slide In Right",
    keyframes: `  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }`,
  },
  slideInUp: {
    name: "Slide In Up",
    keyframes: `  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }`,
  },
  slideInDown: {
    name: "Slide In Down",
    keyframes: `  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }`,
  },
  bounce: {
    name: "Bounce",
    keyframes: `  0%, 20%, 53%, 80%, 100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1);
  }
  40%, 43% {
    transform: translateY(-30px);
    animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
  }
  70% {
    transform: translateY(-15px);
    animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
  }
  90% {
    transform: translateY(-4px);
  }`,
  },
  pulse: {
    name: "Pulse",
    keyframes: `  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }`,
  },
  shake: {
    name: "Shake",
    keyframes: `  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }`,
  },
  tada: {
    name: "Tada",
    keyframes: `  0% { transform: scale3d(1, 1, 1); }
  10%, 20% { transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg); }
  30%, 50%, 70%, 90% { transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg); }
  40%, 60%, 80% { transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg); }
  100% { transform: scale3d(1, 1, 1); }`,
  },
  swing: {
    name: "Swing",
    keyframes: `  20% { transform: rotate3d(0, 0, 1, 15deg); }
  40% { transform: rotate3d(0, 0, 1, -10deg); }
  60% { transform: rotate3d(0, 0, 1, 5deg); }
  80% { transform: rotate3d(0, 0, 1, -5deg); }
  100% { transform: rotate3d(0, 0, 1, 0deg); }`,
  },
  spin: {
    name: "Spin / Rotate",
    keyframes: `  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }`,
  },
  scaleUp: {
    name: "Scale Up",
    keyframes: `  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }`,
  },
  scaleDown: {
    name: "Scale Down",
    keyframes: `  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0); opacity: 0; }`,
  },
  flip: {
    name: "Flip",
    keyframes: `  0% { transform: perspective(400px) rotate3d(0, 1, 0, -360deg); animation-timing-function: ease-out; }
  40% { transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg); animation-timing-function: ease-out; }
  50% { transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg); animation-timing-function: ease-in; }
  80% { transform: perspective(400px) scale3d(0.95, 0.95, 0.95); animation-timing-function: ease-in; }
  100% { transform: perspective(400px); animation-timing-function: ease-in; }`,
  }
};

type PreviewObject = "square" | "circle" | "rocket" | "text";

export default function CssAnimationGenerator() {
  const [selectedPreset, setSelectedPreset] = useState<string>("fadeIn");
  const [duration, setDuration] = useState<number>(1);
  const [delay, setDelay] = useState<number>(0);
  const [iterations, setIterations] = useState<string>("infinite");
  const [timingFn, setTimingFn] = useState<string>("ease-in-out");
  const [direction, setDirection] = useState<string>("normal");
  const [fillMode, setFillMode] = useState<string>("both");
  const [playState, setPlayState] = useState<string>("running");
  
  // Custom cubic-bezier parameters
  const [bezierX1, setBezierX1] = useState<number>(0.25);
  const [bezierY1, setBezierY1] = useState<number>(0.1);
  const [bezierX2, setBezierX2] = useState<number>(0.25);
  const [bezierY2, setBezierY2] = useState<number>(1.0);

  // Preview Object
  const [previewObj, setPreviewObj] = useState<PreviewObject>("square");

  // Force re-animation key
  const [animationKey, setAnimationKey] = useState<number>(0);

  const restartAnimation = () => {
    setAnimationKey((prev) => prev + 1);
  };

  const activeEasing = useMemo(() => {
    if (timingFn === "custom") {
      return `cubic-bezier(${bezierX1}, ${bezierY1}, ${bezierX2}, ${bezierY2})`;
    }
    return timingFn;
  }, [timingFn, bezierX1, bezierY1, bezierX2, bezierY2]);

  const generatedCSS = useMemo(() => {
    return `.element {\n  animation: ${selectedPreset} ${duration}s ${activeEasing} ${delay}s ${iterations} ${direction} ${fillMode};\n}\n\n@keyframes ${selectedPreset} {\n${PRESETS[selectedPreset].keyframes}\n}`;
  }, [selectedPreset, duration, activeEasing, delay, iterations, direction, fillMode]);

  return (
    <div className="space-y-6">
      {/* Keyframe Injection for the preview */}
      <style>{`
        @keyframes ${selectedPreset} {
          ${PRESETS[selectedPreset].keyframes}
        }
        .preview-animated-element {
          animation-name: ${selectedPreset};
          animation-duration: ${duration}s;
          animation-delay: ${delay}s;
          animation-iteration-count: ${iterations};
          animation-timing-function: ${activeEasing};
          animation-direction: ${direction};
          animation-fill-mode: ${fillMode};
          animation-play-state: ${playState};
        }
      `}</style>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Controls Column */}
        <div className="space-y-5 rounded-xl border border-border bg-surface p-5 md:col-span-1 min-w-0">
          <div>
            <label className="mb-2 block text-sm font-medium text-primary">Animation Preset</label>
            <select
              value={selectedPreset}
              onChange={(e) => {
                setSelectedPreset(e.target.value);
                restartAnimation();
              }}
              className="w-full rounded-lg border border-border bg-ground p-2.5 text-sm text-primary focus:outline-none focus:border-accent min-w-0"
            >
              {Object.keys(PRESETS).map((key) => (
                <option key={key} value={key}>
                  {PRESETS[key].name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-primary">
              Duration: <span className="font-mono text-accent">{duration}s</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-accent cursor-pointer h-2 bg-border rounded-lg appearance-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-primary">
              Delay: <span className="font-mono text-accent">{delay}s</span>
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className="w-full accent-accent cursor-pointer h-2 bg-border rounded-lg appearance-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-primary">Iterations</label>
              <select
                value={iterations}
                onChange={(e) => setIterations(e.target.value)}
                className="w-full rounded-lg border border-border bg-ground p-2 text-sm text-primary focus:outline-none focus:border-accent min-w-0"
              >
                <option value="infinite">Infinite</option>
                <option value="1">1 time</option>
                <option value="2">2 times</option>
                <option value="3">3 times</option>
                <option value="5">5 times</option>
                <option value="10">10 times</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-primary">Direction</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full rounded-lg border border-border bg-ground p-2 text-sm text-primary focus:outline-none focus:border-accent min-w-0"
              >
                <option value="normal">Normal</option>
                <option value="reverse">Reverse</option>
                <option value="alternate">Alternate</option>
                <option value="alternate-reverse">Alt-Reverse</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-primary">Easing</label>
              <select
                value={timingFn}
                onChange={(e) => setTimingFn(e.target.value)}
                className="w-full rounded-lg border border-border bg-ground p-2 text-sm text-primary focus:outline-none focus:border-accent min-w-0"
              >
                <option value="linear">Linear</option>
                <option value="ease">Ease</option>
                <option value="ease-in">Ease In</option>
                <option value="ease-out">Ease Out</option>
                <option value="ease-in-out">Ease In Out</option>
                <option value="custom">Custom Bezier</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-primary">Fill Mode</label>
              <select
                value={fillMode}
                onChange={(e) => setFillMode(e.target.value)}
                className="w-full rounded-lg border border-border bg-ground p-2 text-sm text-primary focus:outline-none focus:border-accent min-w-0"
              >
                <option value="none">None</option>
                <option value="forwards">Forwards</option>
                <option value="backwards">Backwards</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          {/* Custom Cubic Bezier parameters */}
          {timingFn === "custom" && (
            <div className="rounded-lg border border-border bg-ground/55 p-3 space-y-3">
              <span className="text-xs font-semibold text-secondary">Cubic-Bezier Parameters</span>
              
              <div>
                <label className="flex justify-between text-[10px] text-secondary font-mono">
                  <span>X1: {bezierX1}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={bezierX1}
                  onChange={(e) => setBezierX1(Number(e.target.value))}
                  className="w-full accent-accent h-1"
                />
              </div>

              <div>
                <label className="flex justify-between text-[10px] text-secondary font-mono">
                  <span>Y1: {bezierY1}</span>
                </label>
                <input
                  type="range"
                  min="-1"
                  max="2"
                  step="0.01"
                  value={bezierY1}
                  onChange={(e) => setBezierY1(Number(e.target.value))}
                  className="w-full accent-accent h-1"
                />
              </div>

              <div>
                <label className="flex justify-between text-[10px] text-secondary font-mono">
                  <span>X2: {bezierX2}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={bezierX2}
                  onChange={(e) => setBezierX2(Number(e.target.value))}
                  className="w-full accent-accent h-1"
                />
              </div>

              <div>
                <label className="flex justify-between text-[10px] text-secondary font-mono">
                  <span>Y2: {bezierY2}</span>
                </label>
                <input
                  type="range"
                  min="-1"
                  max="2"
                  step="0.01"
                  value={bezierY2}
                  onChange={(e) => setBezierY2(Number(e.target.value))}
                  className="w-full accent-accent h-1"
                />
              </div>
            </div>
          )}

          {/* Play state controller */}
          <div className="flex justify-between items-center border-t border-border/50 pt-3.5">
            <span className="text-sm font-semibold text-secondary">Play State</span>
            <button
              onClick={() => setPlayState((prev) => (prev === "running" ? "paused" : "running"))}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                playState === "running"
                  ? "bg-success-bg text-success border border-success-border"
                  : "bg-danger-bg text-danger border border-danger-border"
              }`}
            >
              {playState === "running" ? "Running" : "Paused"}
            </button>
          </div>
        </div>

        {/* Preview & Output Columns */}
        <div className="space-y-5 md:col-span-2 flex flex-col justify-between min-w-0">
          
          {/* Live Preview block */}
          <div className="rounded-xl border border-border bg-surface p-5 flex-1 flex flex-col min-h-[300px]">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <span className="text-sm font-semibold text-primary">Animation Preview</span>

              {/* Preview Object selector */}
              <div className="flex gap-1.5">
                {(["square", "circle", "rocket", "text"] as PreviewObject[]).map((obj) => (
                  <button
                    key={obj}
                    onClick={() => setPreviewObj(obj)}
                    className={`rounded px-2.5 py-1 text-[11px] font-semibold capitalize transition-all ${
                      previewObj === obj
                        ? "bg-accent text-white"
                        : "bg-elevated text-secondary hover:text-primary hover:bg-border"
                    }`}
                  >
                    {obj}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Animation Stage */}
            <div className="flex-1 rounded-xl border border-border bg-background/50 flex items-center justify-center min-h-[180px] relative overflow-hidden">
              <div key={animationKey} className="preview-animated-element flex items-center justify-center">
                {previewObj === "square" && (
                  <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-accent to-accent-hover shadow-lg shadow-accent/25" />
                )}

                {previewObj === "circle" && (
                  <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-success to-emerald-400 shadow-lg shadow-success/20 border-2 border-surface" />
                )}

                {previewObj === "rocket" && (
                  <div className="text-accent-hover drop-shadow-[0_0_12px_rgba(59,130,246,0.3)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5M12 10l-6 6M9 12l-3 3"/><path d="M11.5 3a18.6 18.6 0 0 1 7 7l-1.5 1.5a18.9 18.9 0 0 1-7-7z"/><path d="M8 8.5C8.8 6.9 10.4 5.3 12 4.5l8 8c-.8 1.6-2.4 3.2-4 4l-4-4-4-4z"/><path d="M12 15h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z"/></svg>
                  </div>
                )}

                {previewObj === "text" && (
                  <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-accent via-accent-hover to-purple-400 bg-clip-text text-transparent select-none">
                    DevToolsHub
                  </h1>
                )}
              </div>
            </div>
          </div>

          {/* Code Output block */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-primary">Generated CSS Code</h3>
              </div>
              <CopyButton value={generatedCSS} />
            </div>

            <pre className="overflow-auto rounded-lg bg-ground p-4 text-xs font-mono text-secondary border border-border/50 max-h-48 custom-scrollbar">
              {generatedCSS}
            </pre>
          </div>

        </div>
      </div>

      <ToolActions>
        <Button variant="primary" onClick={restartAnimation}>
          Restart Animation
        </Button>
      </ToolActions>
    </div>
  );
}
