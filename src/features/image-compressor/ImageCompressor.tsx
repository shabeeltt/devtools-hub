import { useState, useRef, useCallback, useEffect } from "react";
import Button from "../../ui/Button";
import ToolActions from "../../components/tool/ToolActions";

type OutputFormat = "auto" | "webp" | "jpeg" | "png";

const checkerboardPattern = {
  backgroundColor: "var(--color-elevated)",
  backgroundImage:
    "linear-gradient(45deg, var(--color-border) 25%, transparent 25%), linear-gradient(-45deg, var(--color-border) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--color-border) 75%), linear-gradient(-45deg, transparent 75%, var(--color-border) 75%)",
  backgroundSize: "16px 16px",
  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
};

// format file size in human readable units
function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

export default function ImageCompressor() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [originalMimeType, setOriginalMimeType] = useState<string>("");
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [outputDimensions, setOutputDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<OutputFormat>("auto");
  const [scale, setScale] = useState<number>(1);

  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalImgRef = useRef<HTMLImageElement | null>(null);
  const originalUrlRef = useRef<string | null>(null);
  const compressedUrlRef = useRef<string | null>(null);
  const requestIdRef = useRef<number>(0);

  // cleanup urls on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
      if (compressedUrlRef.current)
        URL.revokeObjectURL(compressedUrlRef.current);
    };
  }, []);

  // compress image using offscreen canvas
  const runCompression = useCallback(
    (
      img: HTMLImageElement,
      targetQuality: number,
      targetFormat: OutputFormat,
      targetScale: number,
      sourceMime: string,
    ) => {
      const currentRequestId = ++requestIdRef.current;
      setIsCompressing(true);
      setError("");

      // determine output mime type
      let chosenMime = "image/jpeg";
      if (targetFormat === "png") {
        chosenMime = "image/png";
      } else if (targetFormat === "webp") {
        chosenMime = "image/webp";
      } else if (targetFormat === "jpeg") {
        chosenMime = "image/jpeg";
      } else {
        // auto mode selects format based on source
        if (sourceMime === "image/png" || sourceMime === "image/webp") {
          chosenMime = "image/webp";
        } else {
          chosenMime = "image/jpeg";
        }
      }

      // calculate scaled dimensions
      const targetWidth = Math.max(
        1,
        Math.round(img.naturalWidth * targetScale),
      );
      const targetHeight = Math.max(
        1,
        Math.round(img.naturalHeight * targetScale),
      );

      // offscreen canvas avoids dom dependency
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setError("unable to initialize image canvas");
        setIsCompressing(false);
        return;
      }

      // fill white background for jpeg because jpeg does not have alpha channel
      if (chosenMime === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // convert canvas to blob with requested quality
      canvas.toBlob(
        (blob) => {
          // ignore result if another compression request started
          if (currentRequestId !== requestIdRef.current) return;

          if (!blob) {
            setError("compression failed with selected settings");
            setIsCompressing(false);
            return;
          }

          const newCompressedUrl = URL.createObjectURL(blob);
          if (compressedUrlRef.current) {
            URL.revokeObjectURL(compressedUrlRef.current);
          }
          compressedUrlRef.current = newCompressedUrl;

          setCompressedBlob(blob);
          setCompressedUrl(newCompressedUrl);
          setCompressedSize(blob.size);
          setOutputDimensions({ width: targetWidth, height: targetHeight });
          setIsCompressing(false);
        },
        chosenMime,
        targetQuality / 100,
      );
    },
    [],
  );

  // handle user file selection
  const handleFile = useCallback(
    (file: File) => {
      setError("");

      if (!file.type.startsWith("image/")) {
        setError("please select a valid image file");
        return;
      }

      setFileName(file.name);
      setOriginalMimeType(file.type);
      setOriginalSize(file.size);
      setIsCompressing(true);

      // cleanup previous preview url
      if (originalUrlRef.current) {
        URL.revokeObjectURL(originalUrlRef.current);
      }
      if (compressedUrlRef.current) {
        URL.revokeObjectURL(compressedUrlRef.current);
      }

      const objectUrl = URL.createObjectURL(file);
      originalUrlRef.current = objectUrl;
      setOriginalUrl(objectUrl);
      setCompressedUrl(null);
      setCompressedBlob(null);
      setCompressedSize(0);

      const img = new Image();
      img.onload = () => {
        originalImgRef.current = img;
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        runCompression(img, quality, format, scale, file.type);
      };
      img.onerror = () => {
        setError("failed to load image file");
        setIsCompressing(false);
      };
      img.src = objectUrl;
    },
    [quality, format, scale, runCompression],
  );

  // debounced recompression when settings change
  useEffect(() => {
    if (!originalImgRef.current) return;

    const timer = setTimeout(() => {
      if (originalImgRef.current) {
        runCompression(
          originalImgRef.current,
          quality,
          format,
          scale,
          originalMimeType,
        );
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [quality, format, scale, originalMimeType, runCompression]);

  // listen for clipboard paste events
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            handleFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handleFile]);

  // handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // reset all tool states
  const clearAll = () => {
    if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
    if (compressedUrlRef.current) URL.revokeObjectURL(compressedUrlRef.current);
    originalUrlRef.current = null;
    compressedUrlRef.current = null;
    originalImgRef.current = null;

    setOriginalUrl(null);
    setCompressedUrl(null);
    setCompressedBlob(null);
    setFileName("");
    setOriginalMimeType("");
    setOriginalSize(0);
    setCompressedSize(0);
    setDimensions({ width: 0, height: 0 });
    setOutputDimensions({ width: 0, height: 0 });
    setError("");
    setIsCompressing(false);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // download compressed image file
  const downloadCompressed = () => {
    if (!compressedUrl || !compressedBlob) return;

    let extension = "jpg";
    if (compressedBlob.type === "image/webp") extension = "webp";
    else if (compressedBlob.type === "image/png") extension = "png";

    const baseName = fileName.replace(/\.[^/.]+$/, "") || "compressed-image";
    const link = document.createElement("a");
    link.href = compressedUrl;
    link.download = `${baseName}-compressed.${extension}`;
    link.click();
  };

  // copy compressed image to system clipboard
  const copyToClipboard = async () => {
    if (!compressedBlob || !compressedUrl) return;

    try {
      let blobToCopy = compressedBlob;
      // most browsers only accept image png in clipboard item
      if (compressedBlob.type !== "image/png") {
        const img = new Image();
        img.src = compressedUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        const pngBlob = await new Promise<Blob | null>((resolve) =>
          c.toBlob(resolve, "image/png"),
        );
        if (pngBlob) blobToCopy = pngBlob;
      }

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blobToCopy }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("could not copy image to clipboard on this browser");
    }
  };

  // calculate compression savings
  const sizeDiff = originalSize - compressedSize;
  const savingsPercent =
    originalSize > 0 && compressedSize > 0
      ? Math.round((sizeDiff / originalSize) * 100)
      : 0;

  const hasImage = originalUrl !== null;

  return (
    <div className="space-y-6">
      {/* upload dropzone */}
      {!hasImage ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-2xl p-10 md:p-14 text-center cursor-pointer
            transition-all duration-200
            ${
              isDragging
                ? "border-accent bg-accent/10 scale-[0.99]"
                : "border-border hover:border-border-hover hover:bg-surface/50 bg-surface/20"
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>

            <div className="space-y-1">
              <p className="text-primary font-semibold text-lg">
                Drag and drop your image here
              </p>
              <p className="text-secondary text-sm">
                or click to browse from your device
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-elevated border border-border text-xs text-muted">
              <span>Supports JPEG, PNG, WebP, GIF, SVG, AVIF</span>
            </div>

            <p className="text-xs text-muted">
              Tip: You can also paste an image directly from your clipboard
              (Ctrl+V)
            </p>
          </div>
        </div>
      ) : (
        /* image workspace */
        <div className="space-y-6">
          {/* error alert */}
          {error && (
            <div className="bg-danger-bg border border-danger-border rounded-xl p-4 flex items-center justify-between">
              <p className="text-danger text-sm">{error}</p>
              <button
                type="button"
                onClick={() => setError("")}
                className="text-danger hover:opacity-80 text-xs font-semibold px-2 py-1"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* image metadata header */}
          <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1 min-w-[200px]">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-accent/15 text-accent font-medium uppercase">
                  {originalMimeType.replace("image/", "") || "image"}
                </span>
                <p className="text-primary font-medium truncate max-w-xs md:max-w-md">
                  {fileName}
                </p>
              </div>
              <p className="text-xs text-secondary">
                Original: {dimensions.width} × {dimensions.height} px •{" "}
                {formatSize(originalSize)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs px-4 py-2"
              >
                Replace Image
              </Button>
              <Button
                variant="secondary"
                onClick={clearAll}
                className="text-xs px-4 py-2 text-danger hover:text-danger"
              >
                Clear
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>

          {/* controls grid */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* quality slider card */}
            <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="quality-slider"
                  className="text-primary font-medium text-sm"
                >
                  Quality
                </label>
                <span className="text-sm font-semibold text-accent px-2 py-0.5 rounded bg-accent/10">
                  {quality}%
                </span>
              </div>

              <input
                id="quality-slider"
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-elevated rounded-lg appearance-none cursor-pointer accent-accent"
              />

              <div className="flex items-center justify-between text-xs text-muted">
                <span>Smaller file</span>
                <span>Best quality</span>
              </div>

              {/* quick presets */}
              <div className="flex gap-1.5 pt-1">
                {[
                  { label: "Low (50%)", val: 50 },
                  { label: "Balanced (75%)", val: 75 },
                  { label: "High (90%)", val: 90 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setQuality(preset.val)}
                    className={`flex-1 py-1 rounded text-[11px] font-medium border transition-colors ${
                      quality === preset.val
                        ? "bg-accent/20 border-accent text-accent"
                        : "bg-elevated border-border text-secondary hover:border-border-hover hover:text-primary"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* format selector card */}
            <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 space-y-3">
              <label
                htmlFor="format-select"
                className="text-primary font-medium text-sm block"
              >
                Output Format
              </label>

              <select
                id="format-select"
                value={format}
                onChange={(e) => setFormat(e.target.value as OutputFormat)}
                className="w-full bg-elevated border border-border rounded-xl px-3 py-2 text-sm text-primary focus:outline-none focus:border-accent"
              >
                <option value="auto">Auto (Smart WebP / JPEG)</option>
                <option value="webp">WebP (High compression + Alpha)</option>
                <option value="jpeg">JPEG (Universal compatibility)</option>
                <option value="png">PNG (Lossless clarity)</option>
              </select>

              <p className="text-xs text-muted">
                {format === "auto" &&
                  "Automatically uses WebP for transparent files and JPEG for photos"}
                {format === "webp" &&
                  "Modern format with superior compression and full transparency support"}
                {format === "jpeg" &&
                  "Widely supported. Transparent areas will be given a clean white background"}
                {format === "png" &&
                  "Lossless output without compression degradation"}
              </p>
            </div>

            {/* resize and scaling card */}
            <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-primary font-medium text-sm">Resize</span>
                <span className="text-xs text-secondary font-mono">
                  {outputDimensions.width} × {outputDimensions.height} px
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: "100%", val: 1 },
                  { label: "75%", val: 0.75 },
                  { label: "50%", val: 0.5 },
                  { label: "25%", val: 0.25 },
                ].map((s) => (
                  <button
                    key={s.val}
                    type="button"
                    onClick={() => setScale(s.val)}
                    className={`py-2 rounded-xl text-xs font-medium border transition-colors ${
                      scale === s.val
                        ? "bg-accent/20 border-accent text-accent font-semibold"
                        : "bg-elevated border-border text-secondary hover:border-border-hover hover:text-primary"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <p className="text-xs text-muted">
                Scale down image dimensions to significantly reduce file weight
              </p>
            </div>
          </div>

          {/* side by side comparison */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* original preview */}
            <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">
                  Original
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted">
                    {dimensions.width} × {dimensions.height}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-elevated border border-border text-secondary">
                    {formatSize(originalSize)}
                  </span>
                </div>
              </div>

              <div
                style={checkerboardPattern}
                className="rounded-xl overflow-hidden flex items-center justify-center min-h-[220px] max-h-[380px] border border-border"
              >
                <img
                  src={originalUrl}
                  alt="Original"
                  className="max-w-full max-h-[360px] object-contain p-2"
                />
              </div>
            </div>

            {/* compressed preview */}
            <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-primary">
                    Compressed
                  </span>
                  {isCompressing && (
                    <span className="text-xs text-warning animate-pulse">
                      Updating...
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {compressedSize > 0 && !isCompressing && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        sizeDiff > 0
                          ? "bg-success-bg text-success border border-success-border"
                          : "bg-elevated text-muted"
                      }`}
                    >
                      {sizeDiff > 0 ? `-${savingsPercent}%` : "No reduction"}
                    </span>
                  )}
                  <span className="text-xs px-2 py-0.5 rounded bg-elevated border border-border text-secondary">
                    {formatSize(compressedSize)}
                  </span>
                </div>
              </div>

              <div
                style={checkerboardPattern}
                className="rounded-xl overflow-hidden flex items-center justify-center min-h-[220px] max-h-[380px] border border-border relative"
              >
                {isCompressing && (
                  <div className="absolute inset-0 bg-surface/75 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-10">
                    <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
                    <span className="text-xs text-secondary font-medium">
                      Compressing...
                    </span>
                  </div>
                )}

                {compressedUrl ? (
                  <img
                    src={compressedUrl}
                    alt="Compressed output"
                    className="max-w-full max-h-[360px] object-contain p-2"
                  />
                ) : (
                  <span className="text-xs text-muted">
                    Ready to compress...
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* savings summary bar */}
          {compressedSize > 0 && (
            <div className="bg-elevated border border-border rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-secondary">
                <span>Summary:</span>
                <span className="text-primary font-medium">
                  {formatSize(originalSize)}
                </span>
                <span>→</span>
                <span className="text-primary font-semibold">
                  {formatSize(compressedSize)}
                </span>
                {sizeDiff > 0 ? (
                  <span className="text-success font-medium">
                    (Saved {formatSize(sizeDiff)} • {savingsPercent}%)
                  </span>
                ) : (
                  <span className="text-muted">
                    (Output is slightly larger due to high quality or lossless
                    format)
                  </span>
                )}
              </div>

              <div className="text-muted">100% private in-browser compression</div>
            </div>
          )}

          {/* mobile sticky action bar */}
          <div className="md:hidden sticky bottom-4 z-20 bg-surface/90 backdrop-blur-md border border-border rounded-2xl p-3 shadow-xl">
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={downloadCompressed}
                isDisabled={!compressedUrl || isCompressing}
                className="flex-1 py-2.5 text-sm"
              >
                Download ({formatSize(compressedSize)})
              </Button>
              <Button
                variant="secondary"
                onClick={clearAll}
                className="px-4 py-2.5 text-sm"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* desktop action buttons */}
          <div className="hidden md:block">
            <ToolActions>
              <Button
                variant="primary"
                onClick={downloadCompressed}
                isDisabled={!compressedUrl || isCompressing}
              >
                Download Compressed ({formatSize(compressedSize)})
              </Button>

              <Button
                variant="secondary"
                onClick={copyToClipboard}
                isDisabled={!compressedUrl || isCompressing}
              >
                {copied ? "Copied to Clipboard!" : "Copy Image"}
              </Button>

              <Button
                variant="secondary"
                onClick={clearAll}
                isDisabled={isCompressing}
              >
                Clear
              </Button>
            </ToolActions>
          </div>
        </div>
      )}
    </div>
  );
}
