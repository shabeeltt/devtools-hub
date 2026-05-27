import { useState, useRef, useEffect, useCallback } from "react";
import CopyButton from "../../ui/CopyButton";
import Button from "../../ui/Button";
import ToolActions from "../../components/tool/ToolActions";

// ── types ─────────────────────────────────────────────────────────────────────

type ScanMode = "camera" | "upload";
type ScanStatus = "idle" | "scanning" | "found" | "error";

// ── helpers ───────────────────────────────────────────────────────────────────

function isBarcodeDetectorSupported(): boolean {
  return typeof window !== "undefined" && "BarcodeDetector" in window;
}

async function decodeFromImageBitmap(bitmap: ImageBitmap): Promise<string> {
  // @ts-ignore – BarcodeDetector is not yet in TS lib types
  const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
  const codes = await detector.detect(bitmap);
  if (codes.length === 0) throw new Error("No QR code found in image.");
  return codes[0].rawValue as string;
}

async function decodeFromFile(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  return decodeFromImageBitmap(bitmap);
}

// ── component ─────────────────────────────────────────────────────────────────

export default function QrCodeScanner() {
  const [mode, setMode] = useState<ScanMode>("camera");
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [result, setResult] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop the camera stream and cancel any pending animation frame
  const stopStream = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopStream();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopStream]);

  // Scan video frames continuously
  const scanFrame = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);

    try {
      const bitmap = await createImageBitmap(canvas);
      const value = await decodeFromImageBitmap(bitmap);
      stopStream();
      setResult(value);
      setStatus("found");
    } catch {
      // No QR code in this frame — keep scanning
      rafRef.current = requestAnimationFrame(scanFrame);
    }
  }, [stopStream]);

  async function startCamera() {
    if (!isBarcodeDetectorSupported()) {
      setErrorMsg(
        "BarcodeDetector API is not supported in this browser. Try Chrome 88+ or Edge 88+."
      );
      setStatus("error");
      return;
    }

    setResult("");
    setErrorMsg("");
    setStatus("scanning");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsStreaming(true);
      rafRef.current = requestAnimationFrame(scanFrame);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Camera access denied.";
      setErrorMsg(`Could not access camera: ${msg}`);
      setStatus("error");
    }
  }

  function stopCamera() {
    stopStream();
    setStatus("idle");
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isBarcodeDetectorSupported()) {
      setErrorMsg(
        "BarcodeDetector API is not supported in this browser. Try Chrome 88+ or Edge 88+."
      );
      setStatus("error");
      return;
    }

    // Show preview
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setResult("");
    setErrorMsg("");
    setStatus("scanning");

    try {
      const value = await decodeFromFile(file);
      setResult(value);
      setStatus("found");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not read QR code.";
      setErrorMsg(msg);
      setStatus("error");
    }

    // Reset file input so the same file can be re-uploaded
    e.target.value = "";
  }

  function reset() {
    stopStream();
    setResult("");
    setErrorMsg("");
    setStatus("idle");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }

  function switchMode(m: ScanMode) {
    reset();
    setMode(m);
  }

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex overflow-hidden rounded-full border border-border w-fit">
        {(["camera", "upload"] as ScanMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`px-5 py-2 text-sm font-medium capitalize transition-all ${
              mode === m
                ? "bg-accent text-white"
                : "bg-surface text-secondary hover:bg-elevated hover:text-primary"
            }`}
          >
            {m === "camera" ? "📷 Camera" : "🖼️ Upload Image"}
          </button>
        ))}
      </div>

      {/* Camera Mode */}
      {mode === "camera" && (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-xl border border-border bg-surface aspect-video max-w-lg mx-auto flex items-center justify-center">
            <video
              ref={videoRef}
              muted
              playsInline
              className={`w-full h-full object-cover rounded-xl ${isStreaming ? "block" : "hidden"}`}
            />
            {/* Hidden canvas used for frame capture */}
            <canvas ref={canvasRef} className="hidden" />

            {!isStreaming && status !== "found" && (
              <div className="text-center text-secondary p-8">
                <div className="text-4xl mb-3">📷</div>
                <p className="text-sm">Click "Start Camera" to scan a QR code</p>
              </div>
            )}
            {isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-accent rounded-lg opacity-70 animate-pulse" />
              </div>
            )}
          </div>

          <ToolActions>
            {!isStreaming ? (
              <Button variant="primary" onClick={startCamera}>
                Start Camera
              </Button>
            ) : (
              <Button variant="secondary" onClick={stopCamera}>
                Stop Camera
              </Button>
            )}
            {(result || errorMsg) && (
              <Button variant="secondary" onClick={reset}>
                Reset
              </Button>
            )}
          </ToolActions>
        </div>
      )}

      {/* Upload Mode */}
      {mode === "upload" && (
        <div className="space-y-4">
          <div
            className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface p-10 text-center cursor-pointer hover:border-accent/60 hover:bg-elevated transition-all max-w-lg mx-auto"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Uploaded QR"
                className="max-h-48 rounded-lg object-contain"
              />
            ) : (
              <>
                <div className="text-4xl mb-3">🖼️</div>
                <p className="text-sm text-secondary">
                  Click to upload a QR code image
                </p>
                <p className="text-xs text-muted mt-1">PNG, JPG, WEBP supported</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {(result || errorMsg) && (
            <ToolActions>
              <Button variant="secondary" onClick={reset}>
                Clear
              </Button>
            </ToolActions>
          )}
        </div>
      )}

      {/* Result */}
      {status === "scanning" && !result && (
        <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-secondary animate-pulse">
          Scanning…
        </div>
      )}

      {status === "found" && result && (
        <div className="relative rounded-xl border border-accent/40 bg-surface p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-accent uppercase tracking-wide">
              ✅ QR Code Detected
            </span>
            <CopyButton value={result} />
          </div>
          <p className="font-mono text-sm text-primary break-all">{result}</p>
          {result.startsWith("http") && (
            <a
              href={result}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline"
            >
              Open link →
            </a>
          )}
        </div>
      )}

      {status === "error" && errorMsg && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          ⚠️ {errorMsg}
        </div>
      )}
    </div>
  );
}
