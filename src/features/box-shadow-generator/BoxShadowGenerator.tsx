import { useMemo, useState } from "react";
import CopyButton from "../../ui/CopyButton";
import ToolActions from "../../components/tool/ToolActions";

export default function BoxShadowGenerator() {
  const [horizontalOffset, setHorizontalOffset] = useState(0);
  const [verticalOffset, setVerticalOffset] = useState(4);
  const [blurRadius, setBlurRadius] = useState(12);
  const [spreadRadius, setSpreadRadius] = useState(0);
  const [shadowColor, setShadowColor] = useState("#000000");

  const boxShadow = useMemo(
    () => `${horizontalOffset}px ${verticalOffset}px ${blurRadius}px ${spreadRadius}px ${shadowColor}`,
    [horizontalOffset, verticalOffset, blurRadius, spreadRadius, shadowColor],
  );

  const generatedCss = `box-shadow: ${boxShadow};`;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div className="space-y-6 rounded-3xl border border-border bg-surface p-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium">Horizontal offset</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={-50}
                max={50}
                value={horizontalOffset}
                onChange={(event) => setHorizontalOffset(Number(event.target.value))}
                className="w-full"
              />
              <span className="w-16 text-right text-sm text-muted">{horizontalOffset}px</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">Vertical offset</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={-50}
                max={50}
                value={verticalOffset}
                onChange={(event) => setVerticalOffset(Number(event.target.value))}
                className="w-full"
              />
              <span className="w-16 text-right text-sm text-muted">{verticalOffset}px</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">Blur radius</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={100}
                value={blurRadius}
                onChange={(event) => setBlurRadius(Number(event.target.value))}
                className="w-full"
              />
              <span className="w-16 text-right text-sm text-muted">{blurRadius}px</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">Spread radius</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={-50}
                max={50}
                value={spreadRadius}
                onChange={(event) => setSpreadRadius(Number(event.target.value))}
                className="w-full"
              />
              <span className="w-16 text-right text-sm text-muted">{spreadRadius}px</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Shadow color</label>
            <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-3">
              <input
                type="color"
                value={shadowColor}
                onChange={(event) => setShadowColor(event.target.value)}
                className="h-12 w-16 appearance-none rounded-lg border border-border bg-transparent p-0"
              />
              <span className="text-sm text-muted">{shadowColor.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-6">
          <p className="text-sm font-medium text-muted uppercase tracking-[0.2em]">Live preview</p>
          <div className="mt-6 flex items-center justify-center">
            <div
              className="h-56 w-56 rounded-3xl bg-white shadow-lg"
              style={{ boxShadow }}
            >
              <div className="flex h-full items-center justify-center text-sm text-muted">
                Preview box
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted uppercase tracking-[0.2em]">Generated CSS</p>
            <p className="mt-2 font-mono text-sm">{generatedCss}</p>
          </div>
          <ToolActions>
            <CopyButton value={generatedCss} className="mt-2 sm:mt-0" />
          </ToolActions>
        </div>
      </div>
    </div>
  );
}
