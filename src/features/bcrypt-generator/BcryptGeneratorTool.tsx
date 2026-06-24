import { useState } from "react";
import * as bcrypt from "bcryptjs";
import ToolTextarea from "../../components/tool/ToolTextarea";
import CopyButton from "../../ui/CopyButton";
import ToolActions from "../../components/tool/ToolActions";
import Button from "../../ui/Button";
import SampleButton from "../../ui/SampleButton";

export default function BcryptGeneratorTool() {
  const [genInput, setGenInput] = useState("");
  const [saltRounds, setSaltRounds] = useState(10);
  const [genOutput, setGenOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const [valPlaintext, setValPlaintext] = useState("");
  const [valHash, setValHash] = useState("");
  const [valResult, setValResult] = useState<"match" | "no-match" | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  async function handleGenerate() {
    if (!genInput) return;
    setIsGenerating(true);
    try {
      const hash = await bcrypt.hash(genInput, saltRounds);
      setGenOutput(hash);
    } catch {
      setGenOutput("Error generating hash");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleValidate() {
    if (!valPlaintext || !valHash) return;
    setIsValidating(true);
    try {
      const match = await bcrypt.compare(valPlaintext, valHash);
      setValResult(match ? "match" : "no-match");
    } catch {
      setValResult("no-match");
    } finally {
      setIsValidating(false);
    }
  }

  function clearGenerator() {
    setGenInput("");
    setGenOutput("");
  }

  function clearValidator() {
    setValPlaintext("");
    setValHash("");
    setValResult(null);
  }

  function loadSample() {
    setGenInput("mypassword123");
    setSaltRounds(10);
  }

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-primary">Generator</h2>
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface/50 p-4">
          <span className="text-sm font-medium text-secondary">Salt Rounds:</span>
          <div className="flex flex-wrap gap-2">
            {[8, 10, 12, 14].map((r) => (
              <button
                key={r}
                onClick={() => setSaltRounds(r)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                  saltRounds === r
                    ? "bg-accent text-white shadow-lg shadow-accent/20"
                    : "bg-elevated text-secondary hover:bg-border hover:text-primary"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <span className="text-xs text-secondary ml-auto">Higher = more secure but slower</span>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <ToolTextarea
            label="Plaintext"
            value={genInput}
            onChange={setGenInput}
            placeholder="Enter text to hash..."
            rows={6}
            rightLabel={<SampleButton onClick={loadSample} />}
          />
          <ToolTextarea label="Bcrypt Hash" value={genOutput} readOnly rows={6} textColor="accent">
            {genOutput && !genOutput.startsWith("Error") && (
              <CopyButton value={genOutput} className="absolute right-4 top-4" />
            )}
          </ToolTextarea>
        </div>
        <ToolActions>
          <Button onClick={handleGenerate} variant="primary" isDisabled={!genInput || isGenerating}>
            {isGenerating ? "Generating..." : "Generate Hash"}
          </Button>
          <Button onClick={clearGenerator} variant="secondary" isDisabled={!genInput && !genOutput}>
            Clear
          </Button>
        </ToolActions>
      </div>

      <div className="h-px w-full bg-border" />

      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-primary">Validator</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <ToolTextarea
            label="Plaintext"
            value={valPlaintext}
            onChange={setValPlaintext}
            placeholder="Enter plaintext to verify..."
            rows={4}
          />
          <ToolTextarea
            label="Bcrypt Hash"
            value={valHash}
            onChange={setValHash}
            placeholder="Paste bcrypt hash here..."
            rows={4}
          />
        </div>
        {valResult && (
          <div className={`rounded-xl border p-4 text-sm font-medium text-center transition-all ${
            valResult === "match"
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}>
            {valResult === "match"
              ? "✅ Match — plaintext matches the hash"
              : "❌ No Match — plaintext does not match the hash"}
          </div>
        )}
        <ToolActions>
          <Button onClick={handleValidate} variant="primary" isDisabled={!valPlaintext || !valHash || isValidating}>
            {isValidating ? "Validating..." : "Validate"}
          </Button>
          <Button onClick={clearValidator} variant="secondary" isDisabled={!valPlaintext && !valHash && !valResult}>
            Clear
          </Button>
        </ToolActions>
      </div>

      <div className="rounded-xl border border-border bg-surface/50 p-4 text-sm text-secondary">
        <p>
          <strong>Security Note:</strong> All hashing and validation is performed locally in your browser using bcryptjs. Your data never leaves your device.
        </p>
      </div>
    </div>
  );
}