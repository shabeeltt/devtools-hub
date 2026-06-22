import { useState, useEffect, useMemo } from "react";
import { SignJWT, jwtVerify } from "jose";
import Button from "../../ui/Button";
import CopyButton from "../../ui/CopyButton";
import ToolActions from "../../components/tool/ToolActions";

// ── Default Templates ──────────────────────────────────────────────────────────
const TEMPLATES = {
  default: {
    sub: "1234567890",
    name: "John Doe",
    role: "admin",
  },
  auth: {
    sub: "usr_9j2k4l5m",
    email: "jane.doe@example.com",
    email_verified: true,
    scopes: ["read:users", "write:users"],
  },
  minimal: {
    sub: "12345",
  },
  empty: {},
};

// ── Base64 URL Decoder Helper ──────────────────────────────────────────────────
function decodeBase64Url(value: string): any {
  try {
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
  } catch {
    throw new Error("Invalid base64url encoding");
  }
}

// ── Helper to format timestamps ───────────────────────────────────────────────
function formatTimestamp(ts: any): string {
  if (typeof ts !== "number") return "N/A";
  const date = new Date(ts * 1000);
  return date.toLocaleString();
}

function getRelativeTimeString(ts: number): string {
  const diff = ts - Math.floor(Date.now() / 1000);
  const absDiff = Math.abs(diff);

  let timeStr = "";
  if (absDiff < 60) {
    timeStr = `${absDiff}s`;
  } else if (absDiff < 3600) {
    timeStr = `${Math.floor(absDiff / 60)}m`;
  } else if (absDiff < 86400) {
    timeStr = `${Math.floor(absDiff / 3600)}h`;
  } else {
    timeStr = `${Math.floor(absDiff / 86400)}d`;
  }

  if (diff > 0) {
    return `in ${timeStr}`;
  } else {
    return `${timeStr} ago`;
  }
}

// ── Secure Random Secret Generator ─────────────────────────────────────────────
function generateRandomSecretString(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join("");
}

export default function JwtGeneratorValidator() {
  const [activeTab, setActiveTab] = useState<"generator" | "validator">("generator");

  // ── GENERATOR STATES ─────────────────────────────────────────────────────────
  const [algorithm, setAlgorithm] = useState<"HS256" | "HS384" | "HS512">("HS256");
  const [genSecret, setGenSecret] = useState("secret-key-12345678901234567890123456789012");
  const [showGenSecret, setShowGenSecret] = useState(false);
  const [payloadInput, setPayloadInput] = useState(JSON.stringify(TEMPLATES.default, null, 2));
  const [headerInput, setHeaderInput] = useState(
    JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2)
  );

  // Claims
  const [includeExp, setIncludeExp] = useState(true);
  const [expAmount, setExpAmount] = useState(1);
  const [expUnit, setExpUnit] = useState<"seconds" | "minutes" | "hours" | "days">("hours");

  const [includeIat, setIncludeIat] = useState(true);

  const [includeNbf, setIncludeNbf] = useState(false);
  const [nbfAmount, setNbfAmount] = useState(0);
  const [nbfUnit, setNbfUnit] = useState<"seconds" | "minutes" | "hours" | "days">("seconds");

  // Output
  const [generatedToken, setGeneratedToken] = useState("");
  const [genError, setGenError] = useState<string | null>(null);

  // ── VALIDATOR STATES ─────────────────────────────────────────────────────────
  const [valToken, setValToken] = useState("");
  const [valSecret, setValSecret] = useState("");
  const [showValSecret, setShowValSecret] = useState(false);
  const [valResult, setValResult] = useState<{
    header: any;
    payload: any;
    signature: string;
    signatureVerified: boolean;
    isExpired: boolean;
    isNotActiveYet: boolean;
    errorReason: string | null;
  } | null>(null);

  // ── Sync Dropdown Alg with Header JSON ──────────────────────────────────────
  const handleAlgChange = (newAlg: "HS256" | "HS384" | "HS512") => {
    setAlgorithm(newAlg);
    try {
      const parsed = JSON.parse(headerInput);
      parsed.alg = newAlg;
      setHeaderInput(JSON.stringify(parsed, null, 2));
    } catch {
      setHeaderInput(JSON.stringify({ alg: newAlg, typ: "JWT" }, null, 2));
    }
  };

  // ── Templates Handler ────────────────────────────────────────────────────────
  const handleTemplateChange = (templateName: keyof typeof TEMPLATES) => {
    setPayloadInput(JSON.stringify(TEMPLATES[templateName], null, 2));
  };

  // ── Generator Real-time signing ──────────────────────────────────────────────
  useEffect(() => {
    const signToken = async () => {
      try {
        const headerObj = JSON.parse(headerInput);
        const payloadObj = JSON.parse(payloadInput);

        const secretBytes = new TextEncoder().encode(genSecret || "");
        let builder = new SignJWT(payloadObj);

        // Standard checks for claims
        builder = builder.setProtectedHeader(headerObj);

        const now = Math.floor(Date.now() / 1000);

        if (includeIat) {
          builder = builder.setIssuedAt(now);
        }

        if (includeNbf) {
          let offset = nbfAmount;
          if (nbfUnit === "minutes") offset *= 60;
          if (nbfUnit === "hours") offset *= 3600;
          if (nbfUnit === "days") offset *= 86400;
          builder = builder.setNotBefore(now + offset);
        }

        if (includeExp) {
          let offset = expAmount;
          if (expUnit === "minutes") offset *= 60;
          if (expUnit === "hours") offset *= 3600;
          if (expUnit === "days") offset *= 86400;
          builder = builder.setExpirationTime(now + offset);
        }

        const token = await builder.sign(secretBytes);
        setGeneratedToken(token);
        setGenError(null);
      } catch (err: any) {
        setGenError(err.message || "Invalid JSON formatting or signature failure");
        setGeneratedToken("");
      }
    };

    signToken();
  }, [
    headerInput,
    payloadInput,
    genSecret,
    includeExp,
    expAmount,
    expUnit,
    includeIat,
    includeNbf,
    nbfAmount,
    nbfUnit,
  ]);

  // ── Validator real-time validation ───────────────────────────────────────────
  const validateToken = async (tokenStr: string, secretStr: string) => {
    const trimmed = tokenStr.trim();
    if (!trimmed) {
      setValResult(null);
      return;
    }

    const parts = trimmed.split(".");
    if (parts.length !== 3) {
      setValResult({
        header: null,
        payload: null,
        signature: "",
        signatureVerified: false,
        isExpired: false,
        isNotActiveYet: false,
        errorReason: "Invalid JWT token: Must contain exactly 3 parts separated by dots.",
      });
      return;
    }

    let decodedHeader: any = null;
    let decodedPayload: any = null;

    try {
      decodedHeader = decodeBase64Url(parts[0]);
      decodedPayload = decodeBase64Url(parts[1]);
    } catch (err: any) {
      setValResult({
        header: null,
        payload: null,
        signature: "",
        signatureVerified: false,
        isExpired: false,
        isNotActiveYet: false,
        errorReason: "Malformed base64url parts in JWT.",
      });
      return;
    }

    try {
      const alg = decodedHeader?.alg || "HS256";
      const secretBytes = new TextEncoder().encode(secretStr || "");
      
      await jwtVerify(trimmed, secretBytes, {
        algorithms: [alg],
      });

      setValResult({
        header: decodedHeader,
        payload: decodedPayload,
        signature: parts[2],
        signatureVerified: true,
        isExpired: false,
        isNotActiveYet: false,
        errorReason: null,
      });
    } catch (verifyErr: any) {
      let isExpired = false;
      let isNotActiveYet = false;

      if (verifyErr.code === "ERR_JWT_EXPIRED") {
        isExpired = true;
      } else if (verifyErr.code === "ERR_JWT_CLAIM_VALIDATION_FAILED" && verifyErr.claim === "nbf") {
        isNotActiveYet = true;
      }

      setValResult({
        header: decodedHeader,
        payload: decodedPayload,
        signature: parts[2],
        signatureVerified: false,
        isExpired,
        isNotActiveYet,
        errorReason: verifyErr.message || "Signature verification failed",
      });
    }
  };

  useEffect(() => {
    validateToken(valToken, valSecret);
  }, [valToken, valSecret]);

  // ── Reset handlers ───────────────────────────────────────────────────────────
  const resetGenerator = () => {
    setAlgorithm("HS256");
    setGenSecret("secret-key-12345678901234567890123456789012");
    setPayloadInput(JSON.stringify(TEMPLATES.default, null, 2));
    setHeaderInput(JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2));
    setIncludeExp(true);
    setExpAmount(1);
    setExpUnit("hours");
    setIncludeIat(true);
    setIncludeNbf(false);
    setNbfAmount(0);
    setNbfUnit("seconds");
  };

  const resetValidator = () => {
    setValToken("");
    setValSecret("");
    setValResult(null);
  };

  const loadGeneratedIntoValidator = () => {
    if (generatedToken) {
      setValToken(generatedToken);
      setValSecret(genSecret);
      setActiveTab("validator");
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-border pb-px">
        <button
          onClick={() => setActiveTab("generator")}
          className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px text-sm flex items-center gap-2 ${
            activeTab === "generator"
              ? "border-accent text-accent font-semibold"
              : "border-transparent text-secondary hover:text-primary"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          JWT Generator
        </button>
        <button
          onClick={() => setActiveTab("validator")}
          className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px text-sm flex items-center gap-2 ${
            activeTab === "validator"
              ? "border-accent text-accent font-semibold"
              : "border-transparent text-secondary hover:text-primary"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-13.32 9-8.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          JWT Validator & Inspector
        </button>
      </div>

      {/* ── TAB 1: Generator ───────────────────────────────────────────────────── */}
      {activeTab === "generator" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs Column */}
          <div className="space-y-4 rounded-xl border border-border bg-surface p-5 shadow-sm">
            <h3 className="text-base font-semibold text-primary">Configuration</h3>

            {/* Algorithm & Secret */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-secondary">Algorithm</label>
                <select
                  value={algorithm}
                  onChange={(e) => handleAlgChange(e.target.value as any)}
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm text-primary focus:outline-none focus:border-accent"
                >
                  <option value="HS256">HS256 (HMAC SHA-256)</option>
                  <option value="HS384">HS384 (HMAC SHA-384)</option>
                  <option value="HS512">HS512 (HMAC SHA-512)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-secondary">Signature Secret</label>
                  <button
                    onClick={() => setShowGenSecret(!showGenSecret)}
                    className="text-[10px] text-accent hover:underline flex items-center gap-1"
                  >
                    {showGenSecret ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="relative flex gap-2">
                  <input
                    type={showGenSecret ? "text" : "password"}
                    value={genSecret}
                    onChange={(e) => setGenSecret(e.target.value)}
                    placeholder="Enter signing secret"
                    className="flex-1 rounded-xl border border-border bg-background px-3 py-2.5 font-mono text-sm text-primary focus:outline-none focus:border-accent"
                  />
                  <button
                    onClick={() => setGenSecret(generateRandomSecretString(32))}
                    className="rounded-xl bg-elevated hover:bg-border px-3 py-2 text-xs font-semibold text-primary border border-border flex items-center justify-center"
                    title="Generate a cryptographically secure 32-character secret"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>

            {/* Claims Configuration */}
            <div className="border border-border/60 rounded-xl p-4 bg-background/30 space-y-3">
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider">Claims Config</label>
              
              <div className="space-y-3">
                {/* exp */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-sm text-primary font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeExp}
                      onChange={(e) => setIncludeExp(e.target.checked)}
                      className="rounded border-border text-accent focus:ring-accent h-4 w-4 bg-background"
                    />
                    Expiration Time (exp)
                  </label>
                  {includeExp && (
                    <div className="flex gap-2 items-center pl-6 sm:pl-0">
                      <input
                        type="number"
                        min="1"
                        value={expAmount}
                        onChange={(e) => setExpAmount(Math.max(1, Number(e.target.value)))}
                        className="w-16 rounded-lg border border-border bg-background p-1 text-center text-sm text-primary font-mono focus:outline-none focus:border-accent"
                      />
                      <select
                        value={expUnit}
                        onChange={(e) => setExpUnit(e.target.value as any)}
                        className="rounded-lg border border-border bg-background p-1 text-xs text-primary focus:outline-none focus:border-accent"
                      >
                        <option value="seconds">Seconds</option>
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* iat */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-primary font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeIat}
                      onChange={(e) => setIncludeIat(e.target.checked)}
                      className="rounded border-border text-accent focus:ring-accent h-4 w-4 bg-background"
                    />
                    Issued At (iat)
                  </label>
                  <span className="text-xs text-muted font-mono">{includeIat ? "Current Time" : "Omitted"}</span>
                </div>

                {/* nbf */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-sm text-primary font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeNbf}
                      onChange={(e) => setIncludeNbf(e.target.checked)}
                      className="rounded border-border text-accent focus:ring-accent h-4 w-4 bg-background"
                    />
                    Not Before (nbf)
                  </label>
                  {includeNbf && (
                    <div className="flex gap-2 items-center pl-6 sm:pl-0">
                      <input
                        type="number"
                        min="0"
                        value={nbfAmount}
                        onChange={(e) => setNbfAmount(Math.max(0, Number(e.target.value)))}
                        className="w-16 rounded-lg border border-border bg-background p-1 text-center text-sm text-primary font-mono focus:outline-none focus:border-accent"
                      />
                      <select
                        value={nbfUnit}
                        onChange={(e) => setNbfUnit(e.target.value as any)}
                        className="rounded-lg border border-border bg-background p-1 text-xs text-primary focus:outline-none focus:border-accent"
                      >
                        <option value="seconds">Seconds</option>
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Header Editor */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-secondary">Header (JSON)</label>
              <textarea
                value={headerInput}
                onChange={(e) => setHeaderInput(e.target.value)}
                rows={3}
                className="custom-scrollbar w-full rounded-xl border border-border bg-background p-3 font-mono text-sm text-primary outline-none focus:border-accent/50"
              />
            </div>

            {/* Payload Editor */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-secondary">Payload (JSON)</label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted">Template:</span>
                  <select
                    onChange={(e) => handleTemplateChange(e.target.value as any)}
                    className="rounded-lg border border-border bg-background px-2 py-0.5 text-xs text-secondary focus:outline-none"
                    defaultValue="default"
                  >
                    <option value="default">Default User</option>
                    <option value="auth">Auth / Claims</option>
                    <option value="minimal">Minimal</option>
                    <option value="empty">Empty</option>
                  </select>
                </div>
              </div>
              <textarea
                value={payloadInput}
                onChange={(e) => setPayloadInput(e.target.value)}
                rows={6}
                className="custom-scrollbar w-full rounded-xl border border-border bg-background p-3 font-mono text-sm text-primary outline-none focus:border-accent/50"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-border flex justify-end gap-2">
              <button
                onClick={resetGenerator}
                className="rounded-full bg-elevated hover:bg-border px-5 py-2 text-sm font-semibold text-primary transition-all active:scale-95"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Outputs Column */}
          <div className="flex flex-col gap-6">
            {/* Generated JWT Display */}
            <div className="rounded-xl border border-border bg-surface p-5 shadow-sm flex flex-col justify-between flex-1">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-primary">Generated JWT Token</h3>
                  {generatedToken && (
                    <span className="rounded-full bg-success-bg border border-success-border px-2.5 py-0.5 text-[10px] font-bold text-success">
                      Generated in Real-time
                    </span>
                  )}
                </div>

                <div className="relative">
                  <textarea
                    readOnly
                    value={generatedToken || genError || ""}
                    placeholder="Enter valid configuration to generate token..."
                    rows={8}
                    className={`custom-scrollbar w-full rounded-xl border p-4 font-mono text-sm outline-none break-all ${
                      genError
                        ? "border-danger-border bg-danger-bg text-danger"
                        : "border-border bg-background text-accent"
                    }`}
                  />
                  {generatedToken && (
                    <CopyButton
                      value={generatedToken}
                      className="absolute right-3 top-3 text-xs bg-surface shadow-sm border border-border"
                    />
                  )}
                </div>
              </div>

              {generatedToken && (
                <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row gap-2 justify-between items-center">
                  <div className="flex items-center gap-1.5 text-xs text-secondary">
                    <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Ready for API testing or local validation.
                  </div>
                  <Button onClick={loadGeneratedIntoValidator} variant="secondary">
                    Send to Validator
                  </Button>
                </div>
              )}
            </div>

            {/* Live Token Analysis */}
            {generatedToken && (
              <div className="rounded-xl border border-border bg-surface p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-semibold text-primary">Real-time Claims Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-secondary">
                    <thead>
                      <tr className="border-b border-border font-semibold text-primary">
                        <th className="py-2 pr-4">Claim</th>
                        <th className="py-2">Generated Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 font-mono">
                      <tr>
                        <td className="py-2 pr-4 font-semibold text-secondary">alg (Algorithm)</td>
                        <td className="py-2 text-primary">{algorithm}</td>
                      </tr>
                      {includeIat && (
                        <tr>
                          <td className="py-2 pr-4 font-semibold text-secondary">iat (Issued At)</td>
                          <td className="py-2 text-primary">
                            {formatTimestamp(Math.floor(Date.now() / 1000))} (Now)
                          </td>
                        </tr>
                      )}
                      {includeNbf && (
                        <tr>
                          <td className="py-2 pr-4 font-semibold text-secondary">nbf (Not Before)</td>
                          <td className="py-2 text-primary">
                            {formatTimestamp(Math.floor(Date.now() / 1000) + (nbfUnit === "seconds" ? nbfAmount : nbfUnit === "minutes" ? nbfAmount * 60 : nbfUnit === "hours" ? nbfAmount * 3600 : nbfAmount * 86400))} 
                            <span className="text-muted text-[10px] ml-1">
                              ({nbfAmount} {nbfUnit} offset)
                            </span>
                          </td>
                        </tr>
                      )}
                      {includeExp && (
                        <tr>
                          <td className="py-2 pr-4 font-semibold text-secondary">exp (Expiration)</td>
                          <td className="py-2 text-primary">
                            {formatTimestamp(Math.floor(Date.now() / 1000) + (expUnit === "seconds" ? expAmount : expUnit === "minutes" ? expAmount * 60 : expUnit === "hours" ? expAmount * 3600 : expAmount * 86400))} 
                            <span className="text-muted text-[10px] ml-1">
                              (expires in {expAmount} {expUnit})
                            </span>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: Validator & Inspector ───────────────────────────────────────── */}
      {activeTab === "validator" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs Column */}
          <div className="space-y-4 rounded-xl border border-border bg-surface p-5 shadow-sm">
            <h3 className="text-base font-semibold text-primary">Validation Input</h3>

            {/* Token Input */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-secondary">Encoded JWT Token</label>
              <textarea
                value={valToken}
                onChange={(e) => setValToken(e.target.value)}
                placeholder="Paste your encoded JWT token here..."
                rows={8}
                className="custom-scrollbar w-full rounded-xl border border-border bg-background p-3 font-mono text-sm text-primary outline-none focus:border-accent/50 break-all"
              />
            </div>

            {/* Verification Secret */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-secondary">Verification Secret (Key)</label>
                <button
                  onClick={() => setShowValSecret(!showValSecret)}
                  className="text-[10px] text-accent hover:underline flex items-center gap-1"
                >
                  {showValSecret ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showValSecret ? "text" : "password"}
                value={valSecret}
                onChange={(e) => setValSecret(e.target.value)}
                placeholder="Enter token secret to verify signature..."
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 font-mono text-sm text-primary focus:outline-none focus:border-accent"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-border flex justify-between gap-2">
              <Button onClick={() => validateToken(valToken, valSecret)} variant="primary" isDisabled={!valToken.trim()}>
                Verify Token
              </Button>
              <button
                onClick={resetValidator}
                className="rounded-full bg-elevated hover:bg-border px-5 py-2 text-sm font-semibold text-primary transition-all active:scale-95"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Results Column */}
          <div className="space-y-6">
            {valResult ? (
              <>
                {/* Validation Status Indicator */}
                <div
                  className={`rounded-xl border p-4 ${
                    valResult.signatureVerified && !valResult.isExpired && !valResult.isNotActiveYet
                      ? "border-success-border bg-success-bg/60 text-success"
                      : "border-danger-border bg-danger-bg/60 text-danger"
                  }`}
                >
                  <div className="flex gap-3">
                    {valResult.signatureVerified && !valResult.isExpired && !valResult.isNotActiveYet ? (
                      <svg className="h-6 w-6 shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6 shrink-0 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold uppercase tracking-wider">
                        {valResult.signatureVerified && !valResult.isExpired && !valResult.isNotActiveYet
                          ? "Token Valid & Active"
                          : "Validation Failed"}
                      </h4>
                      <ul className="text-xs space-y-1 mt-2 list-none">
                        <li className="flex items-center gap-1.5">
                          {valResult.signatureVerified ? (
                            <span className="text-success">✓ Signature Verified</span>
                          ) : (
                            <span className="text-danger font-medium">✗ Signature Verification Failed ({valResult.errorReason || "Invalid Key"})</span>
                          )}
                        </li>
                        <li className="flex items-center gap-1.5">
                          {valResult.payload && valResult.payload.exp ? (
                            valResult.isExpired ? (
                              <span className="text-danger font-medium">✗ Token Expired (expired {getRelativeTimeString(valResult.payload.exp)})</span>
                            ) : (
                              <span className="text-success">✓ Token Not Expired (expires {getRelativeTimeString(valResult.payload.exp)})</span>
                            )
                          ) : (
                            <span className="text-secondary">○ Expiration (exp) not set</span>
                          )}
                        </li>
                        <li className="flex items-center gap-1.5">
                          {valResult.payload && valResult.payload.nbf ? (
                            valResult.isNotActiveYet ? (
                              <span className="text-danger font-medium">✗ Token Not Active Yet (active {getRelativeTimeString(valResult.payload.nbf)})</span>
                            ) : (
                              <span className="text-success">✓ Token Active (became active {getRelativeTimeString(valResult.payload.nbf)})</span>
                            )
                          ) : (
                            <span className="text-secondary">○ Not Before (nbf) not set</span>
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Decoded Header & Payload Displays */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {valResult.header && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary">Decoded Header</label>
                      <div className="relative">
                        <pre className="custom-scrollbar overflow-auto rounded-xl border border-border bg-surface p-3 font-mono text-xs text-primary max-h-48">
                          {JSON.stringify(valResult.header, null, 2)}
                        </pre>
                        <CopyButton
                          value={JSON.stringify(valResult.header, null, 2)}
                          className="absolute right-2 top-2 text-[10px] bg-background border border-border"
                        />
                      </div>
                    </div>
                  )}

                  {valResult.payload && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary">Decoded Payload</label>
                      <div className="relative">
                        <pre className="custom-scrollbar overflow-auto rounded-xl border border-border bg-surface p-3 font-mono text-xs text-primary max-h-48">
                          {JSON.stringify(valResult.payload, null, 2)}
                        </pre>
                        <CopyButton
                          value={JSON.stringify(valResult.payload, null, 2)}
                          className="absolute right-2 top-2 text-[10px] bg-background border border-border"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Token Metadata Table */}
                {valResult.header && valResult.payload && (
                  <div className="rounded-xl border border-border bg-surface p-5 shadow-sm space-y-3">
                    <h3 className="text-sm font-semibold text-primary">Token Info & Claims</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-secondary">
                        <thead>
                          <tr className="border-b border-border font-semibold text-primary">
                            <th className="py-2 pr-4">Claim</th>
                            <th className="py-2">Value & Date Information</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40 font-mono">
                          <tr>
                            <td className="py-2 pr-4 font-semibold text-secondary">alg (Algorithm)</td>
                            <td className="py-2 text-primary">{valResult.header.alg || "N/A"}</td>
                          </tr>
                          {valResult.payload.iss && (
                            <tr>
                              <td className="py-2 pr-4 font-semibold text-secondary">iss (Issuer)</td>
                              <td className="py-2 text-primary">{valResult.payload.iss}</td>
                            </tr>
                          )}
                          {valResult.payload.sub && (
                            <tr>
                              <td className="py-2 pr-4 font-semibold text-secondary">sub (Subject)</td>
                              <td className="py-2 text-primary">{valResult.payload.sub}</td>
                            </tr>
                          )}
                          {valResult.payload.aud && (
                            <tr>
                              <td className="py-2 pr-4 font-semibold text-secondary">aud (Audience)</td>
                              <td className="py-2 text-primary">
                                {Array.isArray(valResult.payload.aud) ? valResult.payload.aud.join(", ") : valResult.payload.aud}
                              </td>
                            </tr>
                          )}
                          {valResult.payload.iat !== undefined && (
                            <tr>
                              <td className="py-2 pr-4 font-semibold text-secondary">iat (Issued At)</td>
                              <td className="py-2 text-primary">
                                {valResult.payload.iat}
                                <span className="text-muted text-[10px] block sm:inline sm:ml-2 font-sans">
                                  ({formatTimestamp(valResult.payload.iat)})
                                </span>
                              </td>
                            </tr>
                          )}
                          {valResult.payload.nbf !== undefined && (
                            <tr>
                              <td className="py-2 pr-4 font-semibold text-secondary">nbf (Not Before)</td>
                              <td className="py-2 text-primary">
                                {valResult.payload.nbf}
                                <span className="text-muted text-[10px] block sm:inline sm:ml-2 font-sans">
                                  ({formatTimestamp(valResult.payload.nbf)} - {getRelativeTimeString(valResult.payload.nbf)})
                                </span>
                              </td>
                            </tr>
                          )}
                          {valResult.payload.exp !== undefined && (
                            <tr>
                              <td className="py-2 pr-4 font-semibold text-secondary">exp (Expiration)</td>
                              <td className="py-2 text-primary">
                                {valResult.payload.exp}
                                <span className="text-muted text-[10px] block sm:inline sm:ml-2 font-sans">
                                  ({formatTimestamp(valResult.payload.exp)} - {getRelativeTimeString(valResult.payload.exp)})
                                </span>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-surface/50 p-8 text-center text-secondary">
                <svg className="mx-auto h-8 w-8 text-muted mb-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-sm font-medium">Awaiting Input Token</p>
                <p className="text-xs text-muted mt-1">Paste a valid JSON Web Token on the left to see decoded details and validation status.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Security note */}
      <div className="rounded-xl border border-border bg-surface/50 p-4">
        <p className="text-xs leading-relaxed text-muted">
          <span className="font-semibold text-secondary">Security Note:</span>{" "}
          All generation, encoding, decoding, and signature verification takes place entirely client-side within your browser. 
          No token, payload, or secret data is ever transmitted to external servers or APIs.
        </p>
      </div>
    </div>
  );
}
