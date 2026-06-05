import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Html5Qrcode } from "html5-qrcode";
import ToolActions from "../../components/tool/ToolActions";
import Button from "../../ui/Button";
import CopyButton from "../../ui/CopyButton";

export default function QrCodeGenerator() {
  const [tab, setTab] = useState<"generate" | "scan">("generate");
  const [text, setText] = useState("");
  const [scanResult, setScanResult] = useState("");
  const [scanError, setScanError] = useState("");

  const svgRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const handleDownload = () => {
    const svg = svgRef.current?.querySelector("svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "qrcode.svg";
    link.click();

    URL.revokeObjectURL(url);
  };

  const startScanner = async () => {
    if (scannerRef.current) return;

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
  setScanResult(decodedText);
  setScanError("");
},
        () => {}
      );
    }catch (error) {
  console.error(error);
  setScanError("Unable to start camera scanner.");
}
  };

  const stopScanner = async () => {
    if (!scannerRef.current) return;

    try {
      await scannerRef.current.stop();
      await scannerRef.current.clear();
    } catch {}

    scannerRef.current = null;
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const scanner = new Html5Qrcode("qr-reader-image");

    try {
  const result = await scanner.scanFile(file, true);
  setScanResult(result);
  setScanError("");
} catch {
  setScanResult("");
  setScanError("Unable to read QR code.");
}

    await scanner.clear();
  };

  useEffect(() => {
  if (tab !== "scan") {
    stopScanner();
  }

  return () => {
    stopScanner();
  };
}, [tab]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={tab === "generate" ? "primary" : "secondary"}
          onClick={() => setTab("generate")}
        >
          Generate
        </Button>

        <Button
          variant={tab === "scan" ? "primary" : "secondary"}
          onClick={() => setTab("scan")}
        >
          Scan
        </Button>
      </div>

      {tab === "generate" && (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text or URL..."
            className="w-full rounded-xl border border-border bg-surface p-4 min-h-[120px]"
          />

          {text.trim() && (
            <div
              ref={svgRef}
              className="flex justify-center rounded-xl border border-border bg-surface p-4"
            >
              <QRCodeSVG value={text} size={200} />
            </div>
          )}

          <ToolActions>
            <Button
              variant="primary"
              onClick={handleDownload}
              disabled={!text.trim()}
            >
              Download SVG
            </Button>

            <Button variant="secondary" onClick={() => setText("")}>
              Clear
            </Button>
          </ToolActions>
        </>
      )}

      {tab === "scan" && (
        <>
<Button
  variant="primary"
  onClick={startScanner}
>
  Start Scanner
</Button>
          <div
            id="qr-reader"
            className="rounded-xl border border-border bg-surface p-2"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />

          <div id="qr-reader-image" />
{scanError && (
  <div className="rounded-xl border border-border bg-surface p-4">
    {scanError}
  </div>
)}

          {scanResult && (
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center justify-between">
                <span>{scanResult}</span>
                <CopyButton value={scanResult} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}