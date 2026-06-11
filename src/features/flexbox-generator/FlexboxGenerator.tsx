import { useMemo, useState } from "react";
import CopyButton from "../../ui/CopyButton";

type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
type JustifyContent = "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
type AlignItems = "stretch" | "flex-start" | "center" | "flex-end" | "baseline";
type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";

export default function FlexboxGenerator() {
  const [direction, setDirection] = useState<FlexDirection>("row");
  const [justifyContent, setJustifyContent] = useState<JustifyContent>("center");
  const [alignItems, setAlignItems] = useState<AlignItems>("center");
  const [wrap, setWrap] = useState<FlexWrap>("nowrap");
  const [gap, setGap] = useState("16px");

  const formattedCss = useMemo(
    () =>
      `display: flex;\nflex-direction: ${direction};\njustify-content: ${justifyContent};\nalign-items: ${alignItems};\nflex-wrap: ${wrap};\ngap: ${gap};`,
    [direction, justifyContent, alignItems, wrap, gap]
  );

  const previewStyles = useMemo(
    () => ({
      display: "flex",
      flexDirection: direction,
      justifyContent: justifyContent,
      alignItems: alignItems,
      flexWrap: wrap,
      gap,
      padding: "1rem",
      minHeight: "200px",
      backgroundColor: "rgba(56, 189, 248, 0.08)",
      borderRadius: "1rem",
    }),
    [direction, justifyContent, alignItems, wrap, gap]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Flex Direction</label>
          <select
            value={direction}
            onChange={(event) => setDirection(event.target.value as FlexDirection)}
            className="w-full rounded-xl border border-border bg-surface p-3"
          >
            <option value="row">row</option>
            <option value="row-reverse">row-reverse</option>
            <option value="column">column</option>
            <option value="column-reverse">column-reverse</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Justify Content</label>
          <select
            value={justifyContent}
            onChange={(event) => setJustifyContent(event.target.value as JustifyContent)}
            className="w-full rounded-xl border border-border bg-surface p-3"
          >
            <option value="flex-start">flex-start</option>
            <option value="center">center</option>
            <option value="flex-end">flex-end</option>
            <option value="space-between">space-between</option>
            <option value="space-around">space-around</option>
            <option value="space-evenly">space-evenly</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Align Items</label>
          <select
            value={alignItems}
            onChange={(event) => setAlignItems(event.target.value as AlignItems)}
            className="w-full rounded-xl border border-border bg-surface p-3"
          >
            <option value="stretch">stretch</option>
            <option value="flex-start">flex-start</option>
            <option value="center">center</option>
            <option value="flex-end">flex-end</option>
            <option value="baseline">baseline</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Flex Wrap</label>
          <select
            value={wrap}
            onChange={(event) => setWrap(event.target.value as FlexWrap)}
            className="w-full rounded-xl border border-border bg-surface p-3"
          >
            <option value="nowrap">nowrap</option>
            <option value="wrap">wrap</option>
            <option value="wrap-reverse">wrap-reverse</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium">Gap</label>
          <input
            value={gap}
            onChange={(event) => setGap(event.target.value)}
            placeholder="16px"
            className="w-full rounded-xl border border-border bg-surface p-3"
          />
          <p className="mt-2 text-xs text-secondary">
            Use any valid CSS gap value, such as <code>16px</code>, <code>1rem</code>, or <code>1vw</code>.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium">Generated CSS</p>
          <CopyButton value={formattedCss} />
        </div>

        <pre className="overflow-auto rounded-xl bg-background p-4 text-sm">
          {formattedCss}
        </pre>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium">Live Preview</p>
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-secondary">
            {direction}, {justifyContent}, {alignItems}, {wrap}, gap {gap}
          </span>
        </div>

        <div className="rounded-3xl border border-border p-4">
          <div style={previewStyles}>
            <div className="rounded-2xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">Item 1</div>
            <div className="rounded-2xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">Item 2</div>
            <div className="rounded-2xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">Item 3</div>
            <div className="rounded-2xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">Item 4</div>
          </div>
        </div>
      </div>
    </div>
  );
}
