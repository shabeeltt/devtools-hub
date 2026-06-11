import { useState, useEffect, useRef } from "react";
import Button from "../../ui/Button";
import CopyButton from "../../ui/CopyButton";
import ToolActions from "../../components/tool/ToolActions";

interface BreakpointConfig {
  // Layout
  display?: string;
  flexDirection?: string;
  flexWrap?: string;
  justifyContent?: string;
  alignItems?: string;
  gridCols?: string;
  gap?: string;

  // Spacing
  paddingAll?: string;
  paddingX?: string;
  paddingY?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;

  marginAll?: string;
  marginX?: string;
  marginY?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;

  // Sizing
  width?: string;
  height?: string;

  // Typography
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  textTransform?: string;
  textDecoration?: string;
  textColor?: string;

  // Background
  bgColor?: string;
  bgOpacity?: string;

  // Borders & Shadows
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: string;
  boxShadow?: string;
}

const DEFAULT_CONFIG: Record<string, BreakpointConfig> = {
  default: {
    display: "flex",
    alignItems: "items-center",
    justifyContent: "justify-center",
    paddingX: "px-5",
    paddingY: "py-2.5",
    bgColor: "bg-blue-600",
    textColor: "text-white",
    fontSize: "text-sm",
    fontWeight: "font-semibold",
    borderRadius: "rounded-lg",
    boxShadow: "shadow-md",
  },
  sm: {},
  md: {},
  lg: {},
  xl: {},
  "2xl": {},
};

const BREAKPOINTS = [
  { id: "default", name: "Default" },
  { id: "sm", name: "sm (640px)" },
  { id: "md", name: "md (768px)" },
  { id: "lg", name: "lg (1024px)" },
  { id: "xl", name: "xl (1280px)" },
  { id: "2xl", name: "2xl (1536px)" },
];

const CATEGORIES = [
  { id: "layout", name: "Layout & Flex/Grid" },
  { id: "spacing", name: "Spacing & Size" },
  { id: "typography", name: "Typography" },
  { id: "style", name: "Bg, Border & Shadow" },
];

const PRESETS = [
  {
    name: "Primary Button",
    type: "button" as const,
    text: "Click Me",
    config: {
      default: {
        display: "inline-flex",
        alignItems: "items-center",
        justifyContent: "justify-center",
        paddingX: "px-5",
        paddingY: "py-2.5",
        bgColor: "bg-blue-600",
        textColor: "text-white",
        fontSize: "text-sm",
        fontWeight: "font-semibold",
        borderRadius: "rounded-lg",
        boxShadow: "shadow-md",
        gap: "gap-2",
      },
      sm: {},
      md: {
        paddingX: "px-6",
        paddingY: "py-3",
        fontSize: "text-base",
      },
      lg: {},
      xl: {},
      "2xl": {},
    },
  },
  {
    name: "Modern Card",
    type: "card" as const,
    text: "This card can be visually styled with the controls panel on the left.",
    config: {
      default: {
        display: "block",
        paddingAll: "p-6",
        bgColor: "bg-white",
        textColor: "text-slate-800",
        borderRadius: "rounded-2xl",
        boxShadow: "shadow-xl",
        borderWidth: "border",
        borderColor: "border-slate-100",
      },
      sm: {},
      md: {
        paddingAll: "p-8",
      },
      lg: {},
      xl: {},
      "2xl": {},
    },
  },
  {
    name: "Success Badge",
    type: "badge" as const,
    text: "Active Status",
    config: {
      default: {
        display: "inline-flex",
        alignItems: "items-center",
        paddingX: "px-3",
        paddingY: "py-1",
        fontSize: "text-xs",
        fontWeight: "font-semibold",
        bgColor: "bg-emerald-100",
        textColor: "text-emerald-800",
        borderRadius: "rounded-full",
      },
      sm: {},
      md: {},
      lg: {},
      xl: {},
      "2xl": {},
    },
  },
  {
    name: "Alert Box",
    type: "card" as const,
    text: "Warning: Your changes have not been saved yet.",
    config: {
      default: {
        display: "flex",
        alignItems: "items-start",
        paddingAll: "p-4",
        bgColor: "bg-amber-50",
        textColor: "text-amber-800",
        borderRadius: "rounded-xl",
        borderWidth: "border",
        borderColor: "border-amber-200",
        gap: "gap-3",
      },
      sm: {},
      md: {
        alignItems: "items-center",
      },
      lg: {},
      xl: {},
      "2xl": {},
    },
  },
];

const SPACING_SIZES = [
  { label: "Clear / None", value: "" },
  { label: "0 (0px)", value: "0" },
  { label: "0.5 (2px)", value: "0.5" },
  { label: "1 (4px)", value: "1" },
  { label: "1.5 (6px)", value: "1.5" },
  { label: "2 (8px)", value: "2" },
  { label: "2.5 (10px)", value: "2.5" },
  { label: "3 (12px)", value: "3" },
  { label: "4 (16px)", value: "4" },
  { label: "5 (20px)", value: "5" },
  { label: "6 (24px)", value: "6" },
  { label: "8 (32px)", value: "8" },
  { label: "10 (40px)", value: "10" },
  { label: "12 (48px)", value: "12" },
  { label: "16 (64px)", value: "16" },
  { label: "20 (80px)", value: "20" },
  { label: "24 (96px)", value: "24" },
  { label: "32 (128px)", value: "32" },
  { label: "40 (160px)", value: "40" },
  { label: "48 (192px)", value: "48" },
  { label: "56 (224px)", value: "56" },
  { label: "64 (256px)", value: "64" },
];

const WIDTHS = [
  { label: "Auto", value: "w-auto" },
  { label: "Full (100%)", value: "w-full" },
  { label: "Screen (100vw)", value: "w-screen" },
  { label: "Fit Content", value: "w-fit" },
  { label: "Max Content", value: "w-max" },
  { label: "Min Content", value: "w-min" },
  { label: "1/2 (50%)", value: "w-1/2" },
  { label: "1/3 (33.3%)", value: "w-1/3" },
  { label: "2/3 (66.6%)", value: "w-2/3" },
  { label: "1/4 (25%)", value: "w-1/4" },
  { label: "3/4 (75%)", value: "w-3/4" },
  { label: "w-16 (64px)", value: "w-16" },
  { label: "w-24 (96px)", value: "w-24" },
  { label: "w-32 (128px)", value: "w-32" },
  { label: "w-40 (160px)", value: "w-40" },
  { label: "w-48 (192px)", value: "w-48" },
  { label: "w-64 (256px)", value: "w-64" },
  { label: "w-80 (320px)", value: "w-80" },
  { label: "w-96 (384px)", value: "w-96" },
];

const HEIGHTS = [
  { label: "Auto", value: "h-auto" },
  { label: "Full (100%)", value: "h-full" },
  { label: "Screen (100vh)", value: "h-screen" },
  { label: "Fit Content", value: "h-fit" },
  { label: "Max Content", value: "h-max" },
  { label: "Min Content", value: "h-min" },
  { label: "h-16 (64px)", value: "h-16" },
  { label: "h-24 (96px)", value: "h-24" },
  { label: "h-32 (128px)", value: "h-32" },
  { label: "h-40 (160px)", value: "h-40" },
  { label: "h-48 (192px)", value: "h-48" },
  { label: "h-64 (256px)", value: "h-64" },
  { label: "h-80 (320px)", value: "h-80" },
  { label: "h-96 (384px)", value: "h-96" },
];

const BASE_COLORS = [
  { name: "transparent", hex: "transparent" },
  { name: "white", hex: "#ffffff" },
  { name: "black", hex: "#000000" },
  { name: "slate", hex: "#64748b" },
  { name: "gray", hex: "#6b7280" },
  { name: "zinc", hex: "#71717a" },
  { name: "neutral", hex: "#737373" },
  { name: "stone", hex: "#78716c" },
  { name: "red", hex: "#ef4444" },
  { name: "orange", hex: "#f97316" },
  { name: "amber", hex: "#f59e0b" },
  { name: "yellow", hex: "#eab308" },
  { name: "lime", hex: "#84cc16" },
  { name: "green", hex: "#22c55e" },
  { name: "emerald", hex: "#10b981" },
  { name: "teal", hex: "#14b8a6" },
  { name: "cyan", hex: "#06b6d4" },
  { name: "sky", hex: "#0ea5e9" },
  { name: "blue", hex: "#3b82f6" },
  { name: "indigo", hex: "#6366f1" },
  { name: "violet", hex: "#8b5cf6" },
  { name: "purple", hex: "#a855f7" },
  { name: "fuchsia", hex: "#d946ef" },
  { name: "pink", hex: "#ec4899" },
  { name: "rose", hex: "#f43f5e" }
];

const COLOR_SHADES = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

const IFRAME_TEMPLATE = `
<!DOCTYPE html>
<html class="h-full">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {}
        }
      }
    </script>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        min-height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f8fafc;
        transition: background-color 0.2s, color 0.2s;
        font-family: ui-sans-serif, system-ui, sans-serif;
      }
      .dark html, .dark body {
        background-color: #0f172a;
      }
      #preview-container {
        padding: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 100vh;
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <div id="preview-container">
      <div id="preview-element"></div>
    </div>
    <script>
      window.onload = function() {
        if (!window.tailwind) {
          window.parent.postMessage({ type: 'TAILWIND_OFFLINE' }, '*');
        }
      }
    </script>
  </body>
</html>
`;

export default function TailwindClassGenerator() {
  const [config, setConfig] = useState<Record<string, BreakpointConfig>>(DEFAULT_CONFIG);
  const [activeBreakpoint, setActiveBreakpoint] = useState<string>("default");
  const [activeCategory, setActiveCategory] = useState<string>("layout");
  
  // Offline state
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "TAILWIND_OFFLINE") {
        setIsOffline(true);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Color configuration states
  const [colorTarget, setColorTarget] = useState<"bg" | "text" | "border">("bg");
  const [selectedColor, setSelectedColor] = useState<string>("blue");
  const [selectedShade, setSelectedShade] = useState<string>("600");

  // Preview options
  const [elementType, setElementType] = useState<"button" | "card" | "badge" | "input">("button");
  const [customText, setCustomText] = useState<string>("Interactive Button");
  const [previewWidth, setPreviewWidth] = useState<"100%" | "375px" | "768px">("100%");
  const [previewDarkMode, setPreviewDarkMode] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<"classes" | "html" | "jsx" | "apply">("classes");

  // iFrame loaded state
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    let interval: any;
    
    const checkIframe = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc && (doc.readyState === "complete" || doc.readyState === "interactive")) {
        if (doc.getElementById("preview-element")) {
          setIframeLoaded(true);
          if (interval) clearInterval(interval);
        }
      }
    };

    interval = setInterval(checkIframe, 50);
    checkIframe();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  // Compute overall class string
  const getGeneratedClasses = () => {
    const result: string[] = [];
    const orderedBreakpoints = ["default", "sm", "md", "lg", "xl", "2xl"];

    for (const bp of orderedBreakpoints) {
      const properties = config[bp] || {};
      for (const key of Object.keys(properties)) {
        const val = properties[key as keyof BreakpointConfig];
        if (val && val !== "none" && val !== "") {
          if (bp === "default") {
            result.push(val);
          } else {
            result.push(`${bp}:${val}`);
          }
        }
      }
    }
    return result.join(" ");
  };

  const generatedClasses = getGeneratedClasses();

  // Helper to update active config
  const updateProp = (propName: keyof BreakpointConfig, classValue: string) => {
    setConfig((prev) => {
      const currentBpConfig = { ...prev[activeBreakpoint] };
      if (classValue === "" || classValue === "none") {
        delete currentBpConfig[propName];
      } else {
        (currentBpConfig[propName] as string) = classValue;
      }
      return {
        ...prev,
        [activeBreakpoint]: currentBpConfig,
      };
    });
  };

  const resetValues = () => {
    setConfig(DEFAULT_CONFIG);
    setActiveBreakpoint("default");
    setElementType("button");
    setCustomText("Interactive Button");
    setSelectedColor("blue");
    setSelectedShade("600");
    setPreviewDarkMode(false);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setConfig(preset.config);
    setElementType(preset.type);
    setCustomText(preset.text);
    setActiveBreakpoint("default");
  };

  // Sync state to iframe when parameters change
  useEffect(() => {
    if (!iframeLoaded) return;
    const doc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
    if (!doc) return;

    // Apply dark class to body html if preview dark mode is enabled
    const html = doc.documentElement;
    if (previewDarkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    const el = doc.getElementById("preview-element");
    if (el) {
      // Direct class injection
      el.className = generatedClasses;

      // Type-specific HTML rendering
      if (elementType === "button") {
        el.innerHTML = `<button type="button" style="background:transparent; border:none; color:inherit; font:inherit; cursor:pointer; width:100%; height:100%; display:flex; align-items:center; justify-content:center; gap:inherit;">${customText || "Button"}</button>`;
      } else if (elementType === "badge") {
        el.innerHTML = `<span>${customText || "Badge"}</span>`;
      } else if (elementType === "input") {
        el.innerHTML = `<input type="text" style="background:transparent; border:none; outline:none; width:100%; height:100%; text-align:center; color:inherit; font:inherit;" placeholder="${customText || "Enter text..."}" readOnly />`;
      } else if (elementType === "card") {
        el.innerHTML = `
          <div>
            <h4 style="margin:0 0 4px 0; font-weight:bold; font-size:1.125rem;">Card Component</h4>
            <p style="margin:0; font-size:0.875rem; opacity:0.85;">${customText || "Visual visual build using Tailwind configuration settings."}</p>
          </div>
        `;
      }
    }
  }, [iframeLoaded, generatedClasses, elementType, customText, previewDarkMode]);

  // Color application logic
  const handleColorSelect = (color: string, target = colorTarget) => {
    setSelectedColor(color);
    const propName = target === "bg" ? "bgColor" : target === "text" ? "textColor" : "borderColor";
    if (color === "transparent" || color === "white" || color === "black") {
      const classValue = `${target}-${color}`;
      updateProp(propName, classValue);
    } else {
      const classValue = `${target}-${color}-${selectedShade}`;
      updateProp(propName, classValue);
    }
  };

  const handleShadeSelect = (shade: string, target = colorTarget) => {
    setSelectedShade(shade);
    if (selectedColor && selectedColor !== "transparent" && selectedColor !== "white" && selectedColor !== "black") {
      const classValue = `${target}-${selectedColor}-${shade}`;
      const propName = target === "bg" ? "bgColor" : target === "text" ? "textColor" : "borderColor";
      updateProp(propName, classValue);
    }
  };

  // Get current active state for spacing controls
  const activeBpConfig = config[activeBreakpoint] || {};

  // Synchronize color swatches when active breakpoint, target, or config changes
  useEffect(() => {
    const propName = colorTarget === "bg" ? "bgColor" : colorTarget === "text" ? "textColor" : "borderColor";
    const currentClass = activeBpConfig[propName] || "";
    
    if (currentClass) {
      const classWithoutPrefix = currentClass.replace(`${colorTarget}-`, "");
      
      if (["transparent", "white", "black"].includes(classWithoutPrefix)) {
        setSelectedColor(classWithoutPrefix);
      } else {
        const parts = classWithoutPrefix.split("-");
        if (parts.length === 2) {
          setSelectedColor(parts[0]);
          setSelectedShade(parts[1]);
        }
      }
    } else {
      setSelectedColor("");
    }
  }, [activeBreakpoint, colorTarget, config]);

  const getClassByCategory = () => {
    const categories: Record<string, string[]> = {
      layout: [],
      spacing: [],
      typography: [],
      style: [],
    };

    const orderedBreakpoints = ["default", "sm", "md", "lg", "xl", "2xl"];

    for (const bp of orderedBreakpoints) {
      const properties = config[bp] || {};
      const prefix = bp === "default" ? "" : `${bp}:`;

      const add = (cat: string, value: string | undefined) => {
        if (value && value !== "none" && value !== "") {
          categories[cat].push(prefix + value);
        }
      };

      add("layout", properties.display);
      add("layout", properties.flexDirection);
      add("layout", properties.flexWrap);
      add("layout", properties.justifyContent);
      add("layout", properties.alignItems);
      add("layout", properties.gridCols);
      add("layout", properties.gap);

      add("spacing", properties.paddingAll);
      add("spacing", properties.paddingX);
      add("spacing", properties.paddingY);
      add("spacing", properties.paddingTop);
      add("spacing", properties.paddingBottom);
      add("spacing", properties.paddingLeft);
      add("spacing", properties.paddingRight);
      add("spacing", properties.marginAll);
      add("spacing", properties.marginX);
      add("spacing", properties.marginY);
      add("spacing", properties.marginTop);
      add("spacing", properties.marginBottom);
      add("spacing", properties.marginLeft);
      add("spacing", properties.marginRight);
      add("spacing", properties.width);
      add("spacing", properties.height);

      add("typography", properties.fontSize);
      add("typography", properties.fontWeight);
      add("typography", properties.textAlign);
      add("typography", properties.textTransform);
      add("typography", properties.textDecoration);
      add("typography", properties.textColor);

      add("style", properties.bgColor);
      add("style", properties.bgOpacity);
      add("style", properties.borderWidth);
      add("style", properties.borderStyle);
      add("style", properties.borderColor);
      add("style", properties.borderRadius);
      add("style", properties.boxShadow);
    }

    return categories;
  };

  const getExportSnippet = () => {
    switch (exportFormat) {
      case "classes":
        return generatedClasses;
      case "html":
        if (elementType === "button") {
          return `<button class="${generatedClasses}">${customText || "Button"}</button>`;
        } else if (elementType === "badge") {
          return `<span class="${generatedClasses}">${customText || "Badge"}</span>`;
        } else if (elementType === "input") {
          return `<input type="text" class="${generatedClasses}" placeholder="${customText || "Enter text..."}" />`;
        } else {
          return `<div class="${generatedClasses}">
  <h4 class="font-bold text-lg mb-1">Card Component</h4>
  <p class="text-sm opacity-85">${customText || "Visual build template."}</p>
</div>`;
        }
      case "jsx":
        if (elementType === "button") {
          return `<button className="${generatedClasses}">${customText || "Button"}</button>`;
        } else if (elementType === "badge") {
          return `<span className="${generatedClasses}">${customText || "Badge"}</span>`;
        } else if (elementType === "input") {
          return `<input type="text" className="${generatedClasses}" placeholder="${customText || "Enter text..."}" />`;
        } else {
          return `<div className="${generatedClasses}">
  <h4 className="font-bold text-lg mb-1">Card Component</h4>
  <p className="text-sm opacity-85">${customText || "Visual build template."}</p>
</div>`;
        }
      case "apply":
        return `@apply ${generatedClasses};`;
      default:
        return generatedClasses;
    }
  };

  return (
    <div className="space-y-6">
      {/* Preset Section */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <label className="mb-3 block text-sm font-semibold text-secondary">
          Quick Layout Presets
        </label>
        <div className="flex flex-wrap gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="rounded-lg border border-border bg-ground px-4 py-2 text-sm text-primary hover:border-accent hover:bg-elevated transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Controls vs Preview */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Controls Column */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-xl border border-border bg-surface p-5">
            {/* Breakpoint Selector */}
            <div className="mb-5 border-b border-border pb-4">
              <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                Active Breakpoint prefix
              </label>
              <div className="flex flex-wrap gap-1">
                {BREAKPOINTS.map((bp) => (
                  <button
                    key={bp.id}
                    onClick={() => setActiveBreakpoint(bp.id)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                      activeBreakpoint === bp.id
                        ? "bg-accent text-white"
                        : "bg-ground text-secondary hover:bg-elevated"
                    }`}
                  >
                    {bp.name}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted">
                {activeBreakpoint === "default"
                  ? "Configuring default styles applied to all viewports."
                  : `Configuring active styles for sizes matching '${activeBreakpoint}:' (min-width: ${
                      activeBreakpoint === "sm"
                        ? "640px"
                        : activeBreakpoint === "md"
                        ? "768px"
                        : activeBreakpoint === "lg"
                        ? "1024px"
                        : activeBreakpoint === "xl"
                        ? "1280px"
                        : "1536px"
                    }).`}
              </p>
            </div>

            {/* Category Tabs */}
            <div className="mb-6 flex border-b border-border">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition-all -mb-[2px] ${
                    activeCategory === cat.id
                      ? "border-accent text-accent"
                      : "border-transparent text-secondary hover:text-primary"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Category Specific Controls */}
            <div className="space-y-5">
              {/* Category: LAYOUT */}
              {activeCategory === "layout" && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs text-secondary font-medium">Display</label>
                    <select
                      value={activeBpConfig.display || ""}
                      onChange={(e) => updateProp("display", e.target.value)}
                      className="w-full rounded-lg border border-border bg-ground p-2.5 text-sm text-primary"
                    >
                      <option value="">Default (Inline/Block)</option>
                      <option value="flex">flex</option>
                      <option value="inline-flex">inline-flex</option>
                      <option value="grid">grid</option>
                      <option value="inline-grid">inline-grid</option>
                      <option value="block">block</option>
                      <option value="inline-block">inline-block</option>
                      <option value="hidden">hidden</option>
                    </select>
                  </div>

                  {/* Flex Controls */}
                  {((activeBpConfig.display || "").includes("flex")) && (
                    <>
                      <div>
                        <label className="mb-2 block text-xs text-secondary font-medium">Flex Direction</label>
                        <select
                          value={activeBpConfig.flexDirection || ""}
                          onChange={(e) => updateProp("flexDirection", e.target.value)}
                          className="w-full rounded-lg border border-border bg-ground p-2.5 text-sm text-primary"
                        >
                          <option value="">Default</option>
                          <option value="flex-row">flex-row</option>
                          <option value="flex-row-reverse">flex-row-reverse</option>
                          <option value="flex-col">flex-col</option>
                          <option value="flex-col-reverse">flex-col-reverse</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs text-secondary font-medium">Flex Wrap</label>
                        <select
                          value={activeBpConfig.flexWrap || ""}
                          onChange={(e) => updateProp("flexWrap", e.target.value)}
                          className="w-full rounded-lg border border-border bg-ground p-2.5 text-sm text-primary"
                        >
                          <option value="">Default</option>
                          <option value="flex-wrap">flex-wrap</option>
                          <option value="flex-wrap-reverse">flex-wrap-reverse</option>
                          <option value="flex-nowrap">flex-nowrap</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs text-secondary font-medium">Justify Content</label>
                        <select
                          value={activeBpConfig.justifyContent || ""}
                          onChange={(e) => updateProp("justifyContent", e.target.value)}
                          className="w-full rounded-lg border border-border bg-ground p-2.5 text-sm text-primary"
                        >
                          <option value="">Default</option>
                          <option value="justify-start">justify-start</option>
                          <option value="justify-end">justify-end</option>
                          <option value="justify-center">justify-center</option>
                          <option value="justify-between">justify-between</option>
                          <option value="justify-around">justify-around</option>
                          <option value="justify-evenly">justify-evenly</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs text-secondary font-medium">Align Items</label>
                        <select
                          value={activeBpConfig.alignItems || ""}
                          onChange={(e) => updateProp("alignItems", e.target.value)}
                          className="w-full rounded-lg border border-border bg-ground p-2.5 text-sm text-primary"
                        >
                          <option value="">Default</option>
                          <option value="items-start">items-start</option>
                          <option value="items-end">items-end</option>
                          <option value="items-center">items-center</option>
                          <option value="items-baseline">items-baseline</option>
                          <option value="items-stretch">items-stretch</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Grid Controls */}
                  {((activeBpConfig.display || "").includes("grid")) && (
                    <div>
                      <label className="mb-2 block text-xs text-secondary font-medium">Grid Columns</label>
                      <select
                        value={activeBpConfig.gridCols || ""}
                        onChange={(e) => updateProp("gridCols", e.target.value)}
                        className="w-full rounded-lg border border-border bg-ground p-2.5 text-sm text-primary"
                      >
                        <option value="">Default</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((col) => (
                          <option key={col} value={`grid-cols-${col}`}>
                            grid-cols-{col}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Gap (Grid or Flex) */}
                  {((activeBpConfig.display || "").includes("flex") ||
                    (activeBpConfig.display || "").includes("grid")) && (
                    <div>
                      <label className="mb-2 block text-xs text-secondary font-medium">Gap spacing</label>
                      <select
                        value={activeBpConfig.gap || ""}
                        onChange={(e) => updateProp("gap", e.target.value)}
                        className="w-full rounded-lg border border-border bg-ground p-2.5 text-sm text-primary"
                      >
                        <option value="">Default (None)</option>
                        {SPACING_SIZES.filter(s => s.value !== "").map((size) => (
                          <option key={size.value} value={`gap-${size.value}`}>
                            gap-{size.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Category: SPACING & SIZE */}
              {activeCategory === "spacing" && (
                <div className="space-y-6">
                  {/* Padding Selector */}
                  <div className="rounded-lg border border-border/50 bg-ground/50 p-4">
                    <span className="mb-3 block text-xs font-semibold tracking-wide text-secondary uppercase">
                      Padding
                    </span>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs text-muted">All Sides (p-*)</label>
                        <select
                          value={activeBpConfig.paddingAll?.replace("p-", "") || ""}
                          onChange={(e) => updateProp("paddingAll", e.target.value ? `p-${e.target.value}` : "")}
                          className="w-full rounded-lg border border-border bg-ground p-2 text-sm text-primary"
                        >
                          {SPACING_SIZES.map((size) => (
                            <option key={size.value} value={size.value}>
                              {size.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs text-muted">Horizontal (px-*)</label>
                        <select
                          value={activeBpConfig.paddingX?.replace("px-", "") || ""}
                          onChange={(e) => updateProp("paddingX", e.target.value ? `px-${e.target.value}` : "")}
                          className="w-full rounded-lg border border-border bg-ground p-2 text-sm text-primary"
                        >
                          {SPACING_SIZES.map((size) => (
                            <option key={size.value} value={size.value}>
                              {size.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs text-muted">Vertical (py-*)</label>
                        <select
                          value={activeBpConfig.paddingY?.replace("py-", "") || ""}
                          onChange={(e) => updateProp("paddingY", e.target.value ? `py-${e.target.value}` : "")}
                          className="w-full rounded-lg border border-border bg-ground p-2 text-sm text-primary"
                        >
                          {SPACING_SIZES.map((size) => (
                            <option key={size.value} value={size.value}>
                              {size.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs text-muted">Top (pt-*)</label>
                        <select
                          value={activeBpConfig.paddingTop?.replace("pt-", "") || ""}
                          onChange={(e) => updateProp("paddingTop", e.target.value ? `pt-${e.target.value}` : "")}
                          className="w-full rounded-lg border border-border bg-ground p-2 text-sm text-primary"
                        >
                          {SPACING_SIZES.map((size) => (
                            <option key={size.value} value={size.value}>
                              {size.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs text-muted">Bottom (pb-*)</label>
                        <select
                          value={activeBpConfig.paddingBottom?.replace("pb-", "") || ""}
                          onChange={(e) => updateProp("paddingBottom", e.target.value ? `pb-${e.target.value}` : "")}
                          className="w-full rounded-lg border border-border bg-ground p-2 text-sm text-primary"
                        >
                          {SPACING_SIZES.map((size) => (
                            <option key={size.value} value={size.value}>
                              {size.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs text-muted">Left (pl-*)</label>
                        <select
                          value={activeBpConfig.paddingLeft?.replace("pl-", "") || ""}
                          onChange={(e) => updateProp("paddingLeft", e.target.value ? `pl-${e.target.value}` : "")}
                          className="w-full rounded-lg border border-border bg-ground p-2 text-sm text-primary"
                        >
                          {SPACING_SIZES.map((size) => (
                            <option key={size.value} value={size.value}>
                              {size.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs text-muted">Right (pr-*)</label>
                        <select
                          value={activeBpConfig.paddingRight?.replace("pr-", "") || ""}
                          onChange={(e) => updateProp("paddingRight", e.target.value ? `pr-${e.target.value}` : "")}
                          className="w-full rounded-lg border border-border bg-ground p-2 text-sm text-primary"
                        >
                          {SPACING_SIZES.map((size) => (
                            <option key={size.value} value={size.value}>
                              {size.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Margin Selector */}
                  <div className="rounded-lg border border-border/50 bg-ground/50 p-4">
                    <span className="mb-3 block text-xs font-semibold tracking-wide text-secondary uppercase">
                      Margin
                    </span>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs text-muted">All Sides (m-*)</label>
                        <select
                          value={activeBpConfig.marginAll?.replace("m-", "") || ""}
                          onChange={(e) => updateProp("marginAll", e.target.value ? `m-${e.target.value}` : "")}
                          className="w-full rounded-lg border border-border bg-ground p-2 text-sm text-primary"
                        >
                          {SPACING_SIZES.map((size) => (
                            <option key={size.value} value={size.value}>
                              {size.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs text-muted">Horizontal (mx-*)</label>
                        <select
                          value={activeBpConfig.marginX?.replace("mx-", "") || ""}
                          onChange={(e) => updateProp("marginX", e.target.value ? `mx-${e.target.value}` : "")}
                          className="w-full rounded-lg border border-border bg-ground p-2 text-sm text-primary"
                        >
                          {SPACING_SIZES.map((size) => (
                            <option key={size.value} value={size.value}>
                              {size.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs text-muted">Vertical (my-*)</label>
                        <select
                          value={activeBpConfig.marginY?.replace("my-", "") || ""}
                          onChange={(e) => updateProp("marginY", e.target.value ? `my-${e.target.value}` : "")}
                          className="w-full rounded-lg border border-border bg-ground p-2 text-sm text-primary"
                        >
                          {SPACING_SIZES.map((size) => (
                            <option key={size.value} value={size.value}>
                              {size.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs text-muted">Top (mt-*)</label>
                        <select
                          value={activeBpConfig.marginTop?.replace("mt-", "") || ""}
                          onChange={(e) => updateProp("marginTop", e.target.value ? `mt-${e.target.value}` : "")}
                          className="w-full rounded-lg border border-border bg-ground p-2 text-sm text-primary"
                        >
                          {SPACING_SIZES.map((size) => (
                            <option key={size.value} value={size.value}>
                              {size.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs text-muted">Bottom (mb-*)</label>
                        <select
                          value={activeBpConfig.marginBottom?.replace("mb-", "") || ""}
                          onChange={(e) => updateProp("marginBottom", e.target.value ? `mb-${e.target.value}` : "")}
                          className="w-full rounded-lg border border-border bg-ground p-2 text-sm text-primary"
                        >
                          {SPACING_SIZES.map((size) => (
                            <option key={size.value} value={size.value}>
                              {size.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs text-muted">Left (ml-*)</label>
                        <select
                          value={activeBpConfig.marginLeft?.replace("ml-", "") || ""}
                          onChange={(e) => updateProp("marginLeft", e.target.value ? `ml-${e.target.value}` : "")}
                          className="w-full rounded-lg border border-border bg-ground p-2 text-sm text-primary"
                        >
                          {SPACING_SIZES.map((size) => (
                            <option key={size.value} value={size.value}>
                              {size.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs text-muted">Right (mr-*)</label>
                        <select
                          value={activeBpConfig.marginRight?.replace("mr-", "") || ""}
                          onChange={(e) => updateProp("marginRight", e.target.value ? `mr-${e.target.value}` : "")}
                          className="w-full rounded-lg border border-border bg-ground p-2 text-sm text-primary"
                        >
                          {SPACING_SIZES.map((size) => (
                            <option key={size.value} value={size.value}>
                              {size.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Width & Height */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs text-secondary font-medium">Width</label>
                      <select
                        value={activeBpConfig.width || ""}
                        onChange={(e) => updateProp("width", e.target.value)}
                        className="w-full rounded-lg border border-border bg-ground p-2.5 text-sm text-primary"
                      >
                        <option value="">Default (Auto)</option>
                        {WIDTHS.map((w) => (
                          <option key={w.value} value={w.value}>
                            {w.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-secondary font-medium">Height</label>
                      <select
                        value={activeBpConfig.height || ""}
                        onChange={(e) => updateProp("height", e.target.value)}
                        className="w-full rounded-lg border border-border bg-ground p-2.5 text-sm text-primary"
                      >
                        <option value="">Default (Auto)</option>
                        {HEIGHTS.map((h) => (
                          <option key={h.value} value={h.value}>
                            {h.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Category: TYPOGRAPHY */}
              {activeCategory === "typography" && (
                <div className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs text-secondary font-medium">Font Size</label>
                      <select
                        value={activeBpConfig.fontSize || ""}
                        onChange={(e) => updateProp("fontSize", e.target.value)}
                        className="w-full rounded-lg border border-border bg-ground p-2.5 text-sm text-primary"
                      >
                        <option value="">Default</option>
                        <option value="text-xs">text-xs (12px)</option>
                        <option value="text-sm">text-sm (14px)</option>
                        <option value="text-base">text-base (16px)</option>
                        <option value="text-lg">text-lg (18px)</option>
                        <option value="text-xl">text-xl (20px)</option>
                        <option value="text-2xl">text-2xl (24px)</option>
                        <option value="text-3xl">text-3xl (30px)</option>
                        <option value="text-4xl">text-4xl (36px)</option>
                        <option value="text-5xl">text-5xl (48px)</option>
                        <option value="text-6xl">text-6xl (60px)</option>
                        <option value="text-7xl">text-7xl (72px)</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-secondary font-medium">Font Weight</label>
                      <select
                        value={activeBpConfig.fontWeight || ""}
                        onChange={(e) => updateProp("fontWeight", e.target.value)}
                        className="w-full rounded-lg border border-border bg-ground p-2.5 text-sm text-primary"
                      >
                        <option value="">Default</option>
                        <option value="font-thin">font-thin (100)</option>
                        <option value="font-extralight">font-extralight (200)</option>
                        <option value="font-light">font-light (300)</option>
                        <option value="font-normal">font-normal (400)</option>
                        <option value="font-medium">font-medium (500)</option>
                        <option value="font-semibold">font-semibold (600)</option>
                        <option value="font-bold">font-bold (700)</option>
                        <option value="font-extrabold">font-extrabold (800)</option>
                        <option value="font-black">font-black (900)</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-secondary font-medium">Text Align</label>
                      <select
                        value={activeBpConfig.textAlign || ""}
                        onChange={(e) => updateProp("textAlign", e.target.value)}
                        className="w-full rounded-lg border border-border bg-ground p-2.5 text-sm text-primary"
                      >
                        <option value="">Default</option>
                        <option value="text-left">text-left</option>
                        <option value="text-center">text-center</option>
                        <option value="text-right">text-right</option>
                        <option value="text-justify">text-justify</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-secondary font-medium">Text Transform</label>
                      <select
                        value={activeBpConfig.textTransform || ""}
                        onChange={(e) => updateProp("textTransform", e.target.value)}
                        className="w-full rounded-lg border border-border bg-ground p-2.5 text-sm text-primary"
                      >
                        <option value="">Default (None)</option>
                        <option value="uppercase">uppercase</option>
                        <option value="lowercase">lowercase</option>
                        <option value="capitalize">capitalize</option>
                        <option value="normal-case">normal-case</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-secondary font-medium">Text Decoration</label>
                      <select
                        value={activeBpConfig.textDecoration || ""}
                        onChange={(e) => updateProp("textDecoration", e.target.value)}
                        className="w-full rounded-lg border border-border bg-ground p-2.5 text-sm text-primary"
                      >
                        <option value="">Default (None)</option>
                        <option value="underline">underline</option>
                        <option value="line-through">line-through</option>
                        <option value="no-underline">no-underline</option>
                      </select>
                    </div>
                  </div>

                  {/* Text Color Selection */}
                  <div className="border-t border-border pt-4">
                    <span className="mb-3 block text-xs font-semibold text-secondary uppercase">
                      Text Color
                    </span>

                    {/* Mini Swatches Grid */}
                    <div className="mb-3 grid grid-cols-5 gap-2 sm:grid-cols-9">
                      {BASE_COLORS.map((colorObj) => (
                        <button
                          key={colorObj.name}
                          type="button"
                          onClick={() => {
                            setColorTarget("text");
                            handleColorSelect(colorObj.name, "text");
                          }}
                          style={{ backgroundColor: colorObj.hex }}
                          className={`group relative flex h-8 items-center justify-center rounded-lg border border-border transition-all hover:scale-105 ${
                            colorObj.name === "transparent"
                              ? "bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[size:8px_8px] bg-[position:0_0,0_4px,4px_-4px,-4px_0]"
                              : ""
                          } ${
                            selectedColor === colorObj.name
                              ? "ring-2 ring-accent"
                              : ""
                          }`}
                          title={`text-${colorObj.name}`}
                        >
                          {selectedColor === colorObj.name && (
                            <span className={`h-2 w-2 rounded-full ${colorObj.name === "white" || colorObj.name === "transparent" ? "bg-black" : "bg-white"}`} />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Shade Selector */}
                    {selectedColor !== "transparent" && selectedColor !== "white" && selectedColor !== "black" && (
                      <div>
                        <label className="mb-2 block text-xs text-muted">
                          Shade: {selectedShade}
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {COLOR_SHADES.map((shade) => (
                            <button
                              key={shade}
                              type="button"
                              onClick={() => {
                                setColorTarget("text");
                                handleShadeSelect(shade, "text");
                              }}
                              className={`rounded px-2 py-1 text-xs transition-all ${
                                selectedShade === shade
                                  ? "bg-accent text-white"
                                  : "bg-ground text-secondary hover:bg-elevated"
                              }`}
                            >
                              {shade}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Category: BG, BORDER & SHADOW */}
              {activeCategory === "style" && (
                <div className="space-y-5">
                  {/* BG & Border Color Switcher */}
                  <div>
                    <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                      Color Target
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setColorTarget("bg")}
                        className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                          colorTarget === "bg" ? "bg-accent text-white" : "bg-ground text-secondary hover:bg-elevated"
                        }`}
                      >
                        Background Color
                      </button>
                      <button
                        type="button"
                        onClick={() => setColorTarget("border")}
                        className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                          colorTarget === "border" ? "bg-accent text-white" : "bg-ground text-secondary hover:bg-elevated"
                        }`}
                      >
                        Border Color
                      </button>
                    </div>
                  </div>

                  {/* Colors Grid */}
                  <div>
                    <span className="mb-3 block text-xs font-semibold text-secondary uppercase">
                      Select Color ({colorTarget === "bg" ? "bg-*" : "border-*"})
                    </span>
                    <div className="mb-3 grid grid-cols-5 gap-2 sm:grid-cols-9">
                      {BASE_COLORS.map((colorObj) => (
                        <button
                          key={colorObj.name}
                          type="button"
                          onClick={() => handleColorSelect(colorObj.name)}
                          style={{ backgroundColor: colorObj.hex }}
                          className={`group relative flex h-8 items-center justify-center rounded-lg border border-border transition-all hover:scale-105 ${
                            colorObj.name === "transparent"
                              ? "bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[size:8px_8px] bg-[position:0_0,0_4px,4px_-4px,-4px_0]"
                              : ""
                          } ${
                            selectedColor === colorObj.name
                              ? "ring-2 ring-accent"
                              : ""
                          }`}
                          title={`${colorTarget}-${colorObj.name}`}
                        >
                          {selectedColor === colorObj.name && (
                            <span className={`h-2 w-2 rounded-full ${colorObj.name === "white" || colorObj.name === "transparent" ? "bg-black" : "bg-white"}`} />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Shade Selector */}
                    {selectedColor !== "transparent" && selectedColor !== "white" && selectedColor !== "black" && (
                      <div className="mb-4">
                        <label className="mb-2 block text-xs text-muted">
                          Shade: {selectedShade}
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {COLOR_SHADES.map((shade) => (
                            <button
                              key={shade}
                              type="button"
                              onClick={() => handleShadeSelect(shade)}
                              className={`rounded px-2 py-1 text-xs transition-all ${
                                selectedShade === shade
                                  ? "bg-accent text-white"
                                  : "bg-ground text-secondary hover:bg-elevated"
                              }`}
                            >
                              {shade}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* BG Opacity */}
                  {colorTarget === "bg" && (
                    <div>
                      <label className="mb-2 block text-xs text-secondary font-medium">Background Opacity</label>
                      <select
                        value={activeBpConfig.bgOpacity || ""}
                        onChange={(e) => updateProp("bgOpacity", e.target.value)}
                        className="w-full rounded-lg border border-border bg-ground p-2.5 text-sm text-primary"
                      >
                        <option value="">Default (100%)</option>
                        <option value="bg-opacity-0">bg-opacity-0</option>
                        <option value="bg-opacity-10">bg-opacity-10</option>
                        <option value="bg-opacity-20">bg-opacity-20</option>
                        <option value="bg-opacity-30">bg-opacity-30</option>
                        <option value="bg-opacity-40">bg-opacity-40</option>
                        <option value="bg-opacity-50">bg-opacity-50</option>
                        <option value="bg-opacity-75">bg-opacity-75</option>
                        <option value="bg-opacity-90">bg-opacity-90</option>
                        <option value="bg-opacity-100">bg-opacity-100</option>
                      </select>
                    </div>
                  )}

                  {/* Border Width & Style */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs text-secondary font-medium">Border Width</label>
                      <select
                        value={activeBpConfig.borderWidth || ""}
                        onChange={(e) => updateProp("borderWidth", e.target.value)}
                        className="w-full rounded-lg border border-border bg-ground p-2.5 text-sm text-primary"
                      >
                        <option value="">Default (None)</option>
                        <option value="border-0">border-0</option>
                        <option value="border">border (1px)</option>
                        <option value="border-2">border-2 (2px)</option>
                        <option value="border-4">border-4 (4px)</option>
                        <option value="border-8">border-8 (8px)</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-secondary font-medium">Border Style</label>
                      <select
                        value={activeBpConfig.borderStyle || ""}
                        onChange={(e) => updateProp("borderStyle", e.target.value)}
                        className="w-full rounded-lg border border-border bg-ground p-2.5 text-sm text-primary"
                      >
                        <option value="">Default (Solid)</option>
                        <option value="border-solid">border-solid</option>
                        <option value="border-dashed">border-dashed</option>
                        <option value="border-dotted">border-dotted</option>
                        <option value="border-double">border-double</option>
                        <option value="border-none">border-none</option>
                      </select>
                    </div>
                  </div>

                  {/* Border Radius & Shadow */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs text-secondary font-medium">Border Radius</label>
                      <select
                        value={activeBpConfig.borderRadius || ""}
                        onChange={(e) => updateProp("borderRadius", e.target.value)}
                        className="w-full rounded-lg border border-border bg-ground p-2.5 text-sm text-primary"
                      >
                        <option value="">Default (None)</option>
                        <option value="rounded-none">rounded-none</option>
                        <option value="rounded-sm">rounded-sm</option>
                        <option value="rounded">rounded</option>
                        <option value="rounded-md">rounded-md</option>
                        <option value="rounded-lg">rounded-lg</option>
                        <option value="rounded-xl">rounded-xl</option>
                        <option value="rounded-2xl">rounded-2xl</option>
                        <option value="rounded-3xl">rounded-3xl</option>
                        <option value="rounded-full">rounded-full</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-secondary font-medium">Box Shadow</label>
                      <select
                        value={activeBpConfig.boxShadow || ""}
                        onChange={(e) => updateProp("boxShadow", e.target.value)}
                        className="w-full rounded-lg border border-border bg-ground p-2.5 text-sm text-primary"
                      >
                        <option value="">Default (None)</option>
                        <option value="shadow-none">shadow-none</option>
                        <option value="shadow-sm">shadow-sm</option>
                        <option value="shadow">shadow</option>
                        <option value="shadow-md">shadow-md</option>
                        <option value="shadow-lg">shadow-lg</option>
                        <option value="shadow-xl">shadow-xl</option>
                        <option value="shadow-2xl">shadow-2xl</option>
                        <option value="shadow-inner">shadow-inner</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-xl border border-border bg-surface p-5">
            {isOffline && (
              <div className="mb-4 rounded-lg border border-danger-border bg-danger-bg p-3 text-xs text-danger">
                ⚠️ <strong>Live Preview Offline:</strong> The interactive preview requires an active internet connection to load Tailwind CSS dynamically. You can still customize and copy classes.
              </div>
            )}
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <label className="text-sm font-semibold text-secondary">
                Live Preview
              </label>

              {/* Viewport size switcher */}
              <div className="flex gap-1.5">
                <button
                  onClick={() => setPreviewWidth("100%")}
                  className={`rounded px-2.5 py-1 text-xs font-semibold transition-all ${
                    previewWidth === "100%"
                      ? "bg-accent text-white"
                      : "bg-ground text-secondary hover:bg-elevated"
                  }`}
                  title="Desktop Viewport"
                >
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewWidth("768px")}
                  className={`rounded px-2.5 py-1 text-xs font-semibold transition-all ${
                    previewWidth === "768px"
                      ? "bg-accent text-white"
                      : "bg-ground text-secondary hover:bg-elevated"
                  }`}
                  title="Tablet Viewport"
                >
                  Tablet (768px)
                </button>
                <button
                  onClick={() => setPreviewWidth("375px")}
                  className={`rounded px-2.5 py-1 text-xs font-semibold transition-all ${
                    previewWidth === "375px"
                      ? "bg-accent text-white"
                      : "bg-ground text-secondary hover:bg-elevated"
                  }`}
                  title="Mobile Viewport"
                >
                  Mobile (375px)
                </button>
              </div>
            </div>

            {/* Config Panel inside Preview Card */}
            <div className="mb-4 grid gap-4 rounded-xl bg-ground/50 p-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs text-secondary font-medium">Element Type</label>
                <select
                  value={elementType}
                  onChange={(e) => setElementType(e.target.value as any)}
                  className="w-full rounded-lg border border-border bg-ground p-2 text-xs text-primary"
                >
                  <option value="button">Button Element</option>
                  <option value="card">Card Div Block</option>
                  <option value="badge">Badge Span</option>
                  <option value="input">Text Input Field</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-secondary font-medium">Custom Preview Text</label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full rounded-lg border border-border bg-ground px-3 py-2 text-xs text-primary outline-none focus:border-accent/50"
                  placeholder="Change preview text"
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-between border-t border-border pt-3">
                <span className="text-xs text-secondary font-medium">
                  Preview Dark Mode
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewDarkMode(!previewDarkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    previewDarkMode ? "bg-accent" : "bg-border-hover"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      previewDarkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* iFrame Simulator Box */}
            <div className="flex flex-col items-center justify-center p-4 bg-ground rounded-xl border border-border">
              {previewWidth !== "100%" && (
                <div className="mb-2 flex w-full max-w-[768px] justify-center px-2 text-[10px] text-muted font-bold">
                  <span>{previewWidth === "375px" ? "Mobile View (375px)" : "Tablet View (768px)"}</span>
                </div>
              )}
              <div
                style={{ width: previewWidth }}
                className={`relative h-[320px] transition-all duration-300 bg-surface overflow-hidden ${
                  previewWidth === "375px"
                    ? "border-4 border-slate-700 dark:border-slate-800 rounded-2xl shadow-xl"
                    : previewWidth === "768px"
                    ? "border-4 border-slate-700 dark:border-slate-800 rounded-2xl shadow-xl"
                    : "w-full rounded-lg border border-border"
                }`}
              >
                <iframe
                  ref={iframeRef}
                  srcDoc={IFRAME_TEMPLATE}
                  onLoad={handleIframeLoad}
                  className="h-full w-full border-0"
                  title="Tailwind Live Preview Frame"
                />
              </div>
            </div>
          </div>

          {/* Export / Classes Code Output */}
          <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <label className="text-sm font-semibold text-secondary">
                Generated Code Snippet
              </label>

              {/* Format Switcher */}
              <div className="flex gap-1">
                {(["classes", "html", "jsx", "apply"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setExportFormat(fmt)}
                    className={`rounded px-2 py-1 text-xs font-semibold transition-all ${
                      exportFormat === fmt
                        ? "bg-accent text-white"
                        : "bg-ground text-secondary hover:bg-elevated"
                    }`}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Output Field */}
            <div className="relative">
              <textarea
                value={getExportSnippet()}
                readOnly
                rows={4}
                className="w-full rounded-xl border border-border bg-ground p-4 pr-20 font-mono text-sm text-primary outline-none focus:border-accent/50 resize-none"
              />
              <div className="absolute right-3 top-3 z-10">
                <CopyButton value={getExportSnippet()} className="bg-surface hover:bg-elevated shadow" />
              </div>
            </div>

            {/* Visual Class Breakdown Inspector */}
            {generatedClasses && (
              <div className="border-t border-border pt-4 mt-2 space-y-3">
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider block">
                  Class Inspector by Category
                </span>
                <div className="grid gap-3 text-xs sm:grid-cols-2">
                  {Object.entries(getClassByCategory()).map(([catName, classList]) => {
                    if (classList.length === 0) return null;
                    const icons: Record<string, string> = {
                      layout: "📦",
                      spacing: "📐",
                      typography: "🔤",
                      style: "🎨",
                    };
                    const labels: Record<string, string> = {
                      layout: "Layout & Flex/Grid",
                      spacing: "Spacing & Size",
                      typography: "Typography",
                      style: "Bg, Border & Shadow",
                    };
                    return (
                      <div key={catName} className="rounded-lg bg-ground/40 p-2.5 border border-border/40">
                        <span className="font-semibold text-secondary block mb-1">
                          {icons[catName]} {labels[catName]}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {classList.map((cls) => (
                            <span key={cls} className="rounded bg-accent/15 text-accent px-1.5 py-0.5 font-mono text-[10px]">
                              {cls}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tool Reset Actions */}
      <ToolActions>
        <Button variant="secondary" onClick={resetValues}>
          Reset Builder
        </Button>
      </ToolActions>
    </div>
  );
}
