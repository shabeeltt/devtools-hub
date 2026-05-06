import { useState } from "react";
import ToolTextarea from "../../components/tool/ToolTextarea";
import ToolActions from "../../components/tool/ToolActions";
import CopyButton from "../../ui/CopyButton";
import SampleButton from "../../ui/SampleButton";
import Button from "../../ui/Button";

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

  function formatJson(value: unknown): string {
    try {
      return JSON.stringify(value, null, 2);
    } catch (error) {
      return "";
    }
  };

  function clear() {
    setInput("");
    setDecoded({
      header: null,
      payload: null,
      signature: "",
      error: null,
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <ToolTextarea
            label="Encoded JWT"
            value={input}
            onChange={setInput}
            placeholder="Paste your JWT here"
            rows={6}
            rightLabel={
              <SampleButton onClick={loadSample} />
            }
          />
        </div>
      </div>

      <ToolActions>
        <Button
          isDisabled={!hasInput}
          onClick={decodeJwt}
          variant="primary"
        >
          Encode
        </Button>

        {hasOutput && (
          <Button
            onClick={clear}
            variant="secondary"
          >
            Clear
          </Button>
        )}
      </ToolActions>

      {decoded.error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-400">
          {decoded.error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="relative flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-400">
              Header
            </label>

            {canUseHeader && (
              <CopyButton value={formatJson(decoded.header)} />
            )}
          </div>

          <pre className="custom-scrollbar h-[260px] w-full overflow-auto rounded-xl border border-neutral-800 bg-neutral-900 p-4 font-mono text-sm text-blue-400 outline-none">
            {decoded.header
              ? formatJson(decoded.header)
              : "Header will appear here"}
          </pre>
        </div>

        <div className="space-y-2">
          <div className="relative flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-400">
              Payload
            </label>

            {canUsePayload && (
              <CopyButton value={formatJson(decoded.payload)} />
            )}
          </div>

          <pre className="custom-scrollbar h-[260px] w-full overflow-auto rounded-xl border border-neutral-800 bg-neutral-900 p-4 font-mono text-sm text-blue-400 outline-none">
            {decoded.payload
              ? formatJson(decoded.payload)
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
            <CopyButton value={decoded.signature} />
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