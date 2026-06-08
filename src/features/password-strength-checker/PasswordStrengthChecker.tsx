import { useMemo, useState } from "react";
import ToolActions from "../../components/tool/ToolActions";
import Button from "../../ui/Button";

function getStrengthLabel(score: number, length: number) {
  if (length === 0) return "No password entered";
  if (length < 8 || score <= 2) return "Weak";
  if (length < 12 || score <= 4) return "Medium";
  return "Strong";
}

function getStrengthColor(score: number, length: number) {
  if (length === 0) return "bg-border";
  if (length < 8 || score <= 2) return "bg-danger";
  if (length < 12 || score <= 4) return "bg-warning";
  return "bg-success";
}

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");

  const length = password.length;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const score = [hasLowercase, hasUppercase, hasNumber, hasSymbol].filter(Boolean).length + Number(length >= 8) + Number(length >= 12);

  const strength = useMemo(
    () => getStrengthLabel(score, length),
    [score, length],
  );

  const strengthColor = useMemo(
    () => getStrengthColor(score, length),
    [score, length],
  );

  const feedback = useMemo(() => {
    if (!password) {
      return ["Enter a password above to see strength, length, and helpful suggestions."];
    }

    const suggestions = [];

    if (length < 8) {
      suggestions.push("Use at least 8 characters for a usable password.");
    }

    if (length < 12) {
      suggestions.push("Make it longer for extra protection.");
    }

    if (!hasLowercase) {
      suggestions.push("Add lowercase letters.");
    }

    if (!hasUppercase) {
      suggestions.push("Add uppercase letters.");
    }

    if (!hasNumber) {
      suggestions.push("Include numbers.");
    }

    if (!hasSymbol) {
      suggestions.push("Include symbols like ! @ # $ %.");
    }

    if (suggestions.length === 0) {
      suggestions.push(
        "Great job! Your password uses multiple character types and enough length.",
      );
    }

    return suggestions;
  }, [password, length, hasLowercase, hasUppercase, hasNumber, hasSymbol]);

  function clearPassword() {
    setPassword("");
  }

  const progress = Math.min(100, Math.round((score / 6) * 100));

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Type or paste a password..."
          className="w-full rounded-xl border border-border bg-surface p-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Strength</p>
          <p className="mt-2 text-lg font-semibold">{strength}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Length</p>
          <p className="mt-2 text-lg font-semibold">{length}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Character types</p>
          <div className="mt-3 space-y-2 text-sm">
            <p>{hasLowercase ? "✔" : "✕"} lowercase</p>
            <p>{hasUppercase ? "✔" : "✕"} uppercase</p>
            <p>{hasNumber ? "✔" : "✕"} numbers</p>
            <p>{hasSymbol ? "✔" : "✕"} symbols</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium">Strength meter</p>
          <p className="text-sm text-muted">{progress}%</p>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-border">
          <div
            className={`h-full ${strengthColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <p className="text-sm font-medium">Feedback</p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {feedback.map((message) => (
            <li key={message} className="list-disc pl-4">
              {message}
            </li>
          ))}
        </ul>
      </div>

      <ToolActions>
        <Button onClick={clearPassword} variant="secondary" isDisabled={!password}>
          Clear
        </Button>
      </ToolActions>
    </div>
  );
}
