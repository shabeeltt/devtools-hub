import { useState } from "react";

type DecodedJwt = {
  header: unknown;
  payload: unknown;
  signature: string;
  error: string | null;
};

export default function JWTDecoder() {
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<DecodedJwt>({
    header: null,
    payload: null,
    signature: "",
    error: null,
  });
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const hasInput = input.trim().length > 0;
  const hasOutput =
    decoded.header !== null ||
    decoded.payload !== null ||
    decoded.signature.length > 0 ||
    decoded.error !== null;

  const canUseHeader = decoded.header !== null && !decoded.error;
  const canUsePayload = decoded.payload !== null && !decoded.error;
  const canUseSignature = decoded.signature.length > 0 && !decoded.error;

  function decodeBase64Url(value: string) {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    const decodedValue = atob(paddedBase64);
    const json = decodeURIComponent(
      decodedValue
        .split("")
        .map((char) => {
          return `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`;
        })
        .join("")
    );

    return JSON.parse(json);
  }

  function decodeJwt() {
    try {
      const token = input.trim();
      const parts = token.split(".");

      if (parts.length !== 3) {
        throw new Error("invalid jwt");
      }

      setDecoded({
        header: decodeBase64Url(parts[0]),
        payload: decodeBase64Url(parts[1]),
        signature: parts[2],
        error: null,
      });
    } catch {
      setDecoded({
        header: null,
        payload: null,
        signature: "",
        error: "invalid jwt",
      });
    }
  }

  function loadSample() {
    const sampleToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NSIsInVzZXJuYW1lIjoiZHVtbXlVc2VyIiwicm9sZSI6InRlc3RlciIsImlhdCI6MTcxNDcwMDAwMH0.dummysignature1234567890";

    setInput(sampleToken);

    try {
      const parts = sampleToken.split(".");

      setDecoded({
        header: decodeBase64Url(parts[0]),
        payload: decodeBase64Url(parts[1]),
        signature: parts[2],
        error: null,
      });
    } catch {
      setDecoded({
        header: null,
        payload: null,
        signature: "",
        error: "invalid jwt",
      });
    }
  }

  function copyToClipboard(value: unknown, section: string) {
    const text =
      typeof value === "string" ? value : JSON.stringify(value, null, 2);

    navigator.clipboard.writeText(text);
    setCopiedSection(section);

    setTimeout(() => {
      setCopiedSection(null);
    }, 2000);
  }

  function clear() {
    setInput("");
    setDecoded({
      header: null,
      payload: null,
      signature: "",
      error: null,
    });
    setCopiedSection(null);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-neutral-400">
            Encoded JWT
          </label>

          <button
            type="button"
            onClick={loadSample}
            className="text-xs font-medium text-blue-500 transition-colors hover:text-blue-400"
          >
            Sample
          </button>
        </div>

        <textarea
          className="custom-scrollbar w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 font-mono text-sm text-white outline-none transition-colors focus:border-blue-500/50"
          rows={4}
          placeholder="Paste your JWT here"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      </div>

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          disabled={!hasInput}
          onClick={decodeJwt}
          className={`rounded-full px-8 py-3 font-semibold text-white transition-all active:scale-95 ${
            hasInput
              ? "bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
              : "cursor-not-allowed bg-neutral-700 opacity-50"
          }`}
        >
          Decode JWT
        </button>

        {hasOutput && (
          <button
            type="button"
            onClick={clear}
            className="rounded-full bg-neutral-600 px-8 py-3 font-semibold text-white transition-all hover:bg-neutral-700 hover:shadow-lg hover:shadow-neutral-500/20 active:scale-95"
          >
            Clear
          </button>
        )}
      </div>

      {decoded.error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-400">
          {decoded.error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-400">
              Header
            </label>

            {canUseHeader && (
              <button
                type="button"
                onClick={() => copyToClipboard(decoded.header, "header")}
                className="rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
              >
                {copiedSection === "header" ? "Copied" : "Copy"}
              </button>
            )}
          </div>

          <pre className="custom-scrollbar h-[260px] w-full overflow-auto rounded-xl border border-neutral-800 bg-neutral-900 p-4 font-mono text-sm text-blue-400 outline-none">
            {decoded.header
              ? JSON.stringify(decoded.header, null, 2)
              : "Header will appear here"}
          </pre>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-400">
              Payload
            </label>

            {canUsePayload && (
              <button
                type="button"
                onClick={() => copyToClipboard(decoded.payload, "payload")}
                className="rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
              >
                {copiedSection === "payload" ? "Copied" : "Copy"}
              </button>
            )}
          </div>

          <pre className="custom-scrollbar h-[260px] w-full overflow-auto rounded-xl border border-neutral-800 bg-neutral-900 p-4 font-mono text-sm text-blue-400 outline-none">
            {decoded.payload
              ? JSON.stringify(decoded.payload, null, 2)
              : "Payload will appear here"}
          </pre>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-neutral-400">
            Signature
          </label>

          {canUseSignature && (
            <button
              type="button"
              onClick={() => copyToClipboard(decoded.signature, "signature")}
              className="rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
            >
              {copiedSection === "signature" ? "Copied" : "Copy"}
            </button>
          )}
        </div>

        <pre className="custom-scrollbar min-h-[90px] w-full overflow-auto break-all rounded-xl border border-neutral-800 bg-neutral-900 p-4 font-mono text-sm text-blue-400 outline-none">
          {decoded.signature || "Signature will appear here"}
        </pre>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
        <p className="text-xs leading-relaxed text-neutral-500">
          <span className="font-semibold text-neutral-400">Security note:</span>{" "}
          this tool only decodes jwt data in your browser. decoding does not
          verify the signature or prove the token is trusted.
        </p>
      </div>
    </div>
  );
}