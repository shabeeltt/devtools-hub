import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import CopyButton from "../../ui/CopyButton";
import ToolActions from "../../components/tool/ToolActions";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);

  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);

  const [password, setPassword] = useState("");

  function generatePassword() {
    let chars = "";

    if (uppercase) chars += UPPERCASE;
    if (lowercase) chars += LOWERCASE;
    if (numbers) chars += NUMBERS;
    if (symbols) chars += SYMBOLS;

    if (!chars) {
      setPassword("");
      return;
    }

    let result = "";

    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * chars.length);
      result += chars[index];
    }

    setPassword(result);
  }

  useEffect(() => {
    generatePassword();
  }, [length, uppercase, lowercase, numbers, symbols]);

  const enabledGroups =
    Number(uppercase) +
    Number(lowercase) +
    Number(numbers) +
    Number(symbols);

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm">
          Password Length: {length}
        </label>

        <input
          type="range"
          min="4"
          max="128"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="grid gap-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={uppercase}
            disabled={enabledGroups === 1 && uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
          />
          Uppercase Letters
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={lowercase}
            disabled={enabledGroups === 1 && lowercase}
            onChange={(e) => setLowercase(e.target.checked)}
          />
          Lowercase Letters
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={numbers}
            disabled={enabledGroups === 1 && numbers}
            onChange={(e) => setNumbers(e.target.checked)}
          />
          Numbers
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={symbols}
            disabled={enabledGroups === 1 && symbols}
            onChange={(e) => setSymbols(e.target.checked)}
          />
          Symbols
        </label>
      </div>

      <div className="relative">
        <input
          readOnly
          value={password}
          className="w-full rounded-xl border border-border bg-surface p-4 font-mono text-sm"
        />

        {password && (
          <CopyButton
            value={password}
            className="absolute right-4 top-4"
          />
        )}
      </div>

      <ToolActions>
        <Button
          variant="primary"
          onClick={generatePassword}
        >
          Generate Password
        </Button>
      </ToolActions>
    </div>
  );
}
