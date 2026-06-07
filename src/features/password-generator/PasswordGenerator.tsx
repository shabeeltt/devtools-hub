import { useEffect, useState, useMemo } from "react";
import Button from "../../ui/Button";
import CopyButton from "../../ui/CopyButton";
import ToolActions from "../../components/tool/ToolActions";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,./<>?";

const SIMILAR_CHARS = /[il1Lo0O]/g;

// A premium word list for generating readable passphrases offline (150 words)
const WORDS = [
  "apple", "apricot", "autumn", "anchor", "arrow", "airport", "avatar", "artist",
  "banana", "breeze", "bridge", "branch", "bronze", "bamboo", "beacon", "butter",
  "cherry", "crystal", "cloud", "castle", "canyon", "copper", "comet", "cosmos",
  "desert", "dragon", "dolphin", "durian", "dawn", "diamond", "drift", "dream",
  "forest", "flower", "feather", "fossil", "flame", "frost", "falcon", "guitar",
  "garden", "galaxy", "glacier", "golden", "granite", "grape", "harbor", "hunter",
  "island", "jungle", "jasper", "kettle", "lagoon", "lantern", "lizard", "lemon",
  "meadow", "mountain", "meteor", "marble", "maple", "monkey", "morning", "music",
  "nature", "nebula", "needle", "noodle", "night", "ocean", "orange", "orchid",
  "planet", "palace", "pebble", "prism", "purple", "python", "paper", "pencil",
  "quartz", "quiver", "river", "rabbit", "rhythm", "radar", "shadow", "silver",
  "spring", "summer", "winter", "safari", "shield", "summit", "sensor", "silent",
  "timber", "temple", "tunnel", "tiger", "tulip", "twilight", "under", "valley",
  "velvet", "volcano", "vessel", "violin", "whisper", "window", "winter", "wizard",
  "yellow", "zebra", "zenith", "bright", "clever", "gentle", "honest", "lively",
  "proud", "robust", "simple", "warm", "quick", "brave", "happy", "lucky",
  "active", "beacon", "canvas", "cradle", "engine", "foxtrot", "gimble", "helium",
  "impact", "joker", "kernel", "liquid", "matrix", "neutron", "oxygen", "pixel",
  "quantum", "rocket", "spiral", "vector", "widget", "yarn", "zero", "zigzag"
];

export default function PasswordGenerator() {
  const [activeTab, setActiveTab] = useState<"random" | "passphrase">("random");

  // ── Random Password States ──────────────────────────────────────────────────
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);

  // ── Passphrase States ──────────────────────────────────────────────────────
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState("-");
  const [capitalize, setCapitalize] = useState(true);
  const [includeNumber, setIncludeNumber] = useState(true);

  // ── Shared Output ──────────────────────────────────────────────────────────
  const [password, setPassword] = useState("");

  const enabledGroups =
    Number(uppercase) +
    Number(lowercase) +
    Number(numbers) +
    Number(symbols);

  function generatePassword() {
    if (activeTab === "random") {
      let chars = "";
      if (uppercase) chars += UPPERCASE;
      if (lowercase) chars += LOWERCASE;
      if (numbers) chars += NUMBERS;
      if (symbols) chars += SYMBOLS;

      if (excludeSimilar) {
        // Remove i, l, 1, L, o, 0, O from potential chars
        chars = chars.replace(SIMILAR_CHARS, "");
      }

      if (!chars) {
        setPassword("");
        return;
      }

      let result = "";
      // Use crypto.getRandomValues if available, fallback to Math.random
      const array = new Uint32Array(length);
      if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(array);
      } else {
        for (let i = 0; i < length; i++) {
          array[i] = Math.floor(Math.random() * 1000000);
        }
      }

      for (let i = 0; i < length; i++) {
        const index = array[i] % chars.length;
        result += chars[index];
      }
      setPassword(result);
    } else {
      // Passphrase Mode
      const wordsArray: string[] = [];
      const array = new Uint32Array(wordCount);
      if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(array);
      } else {
        for (let i = 0; i < wordCount; i++) {
          array[i] = Math.floor(Math.random() * WORDS.length);
        }
      }

      for (let i = 0; i < wordCount; i++) {
        let word = WORDS[array[i] % WORDS.length];
        if (capitalize) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        wordsArray.push(word);
      }

      let result = wordsArray.join(separator);
      if (includeNumber) {
        const randNum = Math.floor(Math.random() * 100);
        result += `${separator}${randNum}`;
      }
      setPassword(result);
    }
  }

  // Regenerate when states change
  useEffect(() => {
    generatePassword();
  }, [
    activeTab,
    length,
    uppercase,
    lowercase,
    numbers,
    symbols,
    excludeSimilar,
    wordCount,
    separator,
    capitalize,
    includeNumber,
  ]);

  // Calculate Strength score (1 to 4)
  const strengthScore = useMemo(() => {
    if (!password) return 0;
    if (activeTab === "passphrase") {
      if (wordCount < 3) return 1; // Weak
      if (wordCount === 3) return 2; // Medium
      if (wordCount === 4) return 3; // Strong
      return 4; // Very Strong
    } else {
      let score = 0;
      if (length >= 8) score += 1;
      if (length >= 12) score += 1;
      if (length >= 16) score += 1;

      // Add points for variation
      const variations =
        Number(uppercase) +
        Number(lowercase) +
        Number(numbers) +
        Number(symbols);
      
      if (variations >= 3 && length >= 10) score += 1;

      return Math.max(1, Math.min(4, score));
    }
  }, [password, activeTab, length, uppercase, lowercase, numbers, symbols, wordCount]);

  const strengthDetails = useMemo(() => {
    switch (strengthScore) {
      case 1:
        return { label: "Weak", color: "bg-danger" };
      case 2:
        return { label: "Medium", color: "bg-warning" };
      case 3:
        return { label: "Strong", color: "bg-accent" };
      case 4:
        return { label: "Very Strong", color: "bg-success" };
      default:
        return { label: "Too Short", color: "bg-border" };
    }
  }, [strengthScore]);

  return (
    <div className="space-y-6">
      {/* Mode Navigation */}
      <div className="flex gap-2 border-b border-border pb-px">
        <button
          onClick={() => setActiveTab("random")}
          className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px text-sm ${
            activeTab === "random"
              ? "border-accent text-accent font-semibold"
              : "border-transparent text-secondary hover:text-primary"
          }`}
        >
          Random Password
        </button>
        <button
          onClick={() => setActiveTab("passphrase")}
          className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px text-sm ${
            activeTab === "passphrase"
              ? "border-accent text-accent font-semibold"
              : "border-transparent text-secondary hover:text-primary"
          }`}
        >
          Memorable Passphrase
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Controls Panel */}
        <div className="space-y-5 rounded-xl border border-border bg-surface p-5 md:col-span-1">
          {activeTab === "random" ? (
            <>
              {/* Random controls */}
              <div>
                <label className="mb-2.5 block text-sm font-medium text-primary">
                  Length: <span className="font-mono font-bold text-accent">{length}</span>
                </label>
                <input
                  type="range"
                  min="4"
                  max="128"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full accent-accent cursor-pointer"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2.5 text-sm text-secondary cursor-pointer hover:text-primary">
                  <input
                    type="checkbox"
                    checked={uppercase}
                    disabled={enabledGroups === 1 && uppercase}
                    onChange={(e) => setUppercase(e.target.checked)}
                    className="rounded text-accent focus:ring-accent accent-accent size-4"
                  />
                  Uppercase Letters (A-Z)
                </label>

                <label className="flex items-center gap-2.5 text-sm text-secondary cursor-pointer hover:text-primary">
                  <input
                    type="checkbox"
                    checked={lowercase}
                    disabled={enabledGroups === 1 && lowercase}
                    onChange={(e) => setLowercase(e.target.checked)}
                    className="rounded text-accent focus:ring-accent accent-accent size-4"
                  />
                  Lowercase Letters (a-z)
                </label>

                <label className="flex items-center gap-2.5 text-sm text-secondary cursor-pointer hover:text-primary">
                  <input
                    type="checkbox"
                    checked={numbers}
                    disabled={enabledGroups === 1 && numbers}
                    onChange={(e) => setNumbers(e.target.checked)}
                    className="rounded text-accent focus:ring-accent accent-accent size-4"
                  />
                  Numbers (0-9)
                </label>

                <label className="flex items-center gap-2.5 text-sm text-secondary cursor-pointer hover:text-primary">
                  <input
                    type="checkbox"
                    checked={symbols}
                    disabled={enabledGroups === 1 && symbols}
                    onChange={(e) => setSymbols(e.target.checked)}
                    className="rounded text-accent focus:ring-accent accent-accent size-4"
                  />
                  Symbols (!@#$%^&*)
                </label>

                <div className="border-t border-border/50 my-2 pt-2">
                  <label className="flex items-center gap-2.5 text-sm text-secondary cursor-pointer hover:text-primary">
                    <input
                      type="checkbox"
                      checked={excludeSimilar}
                      onChange={(e) => setExcludeSimilar(e.target.checked)}
                      className="rounded text-accent focus:ring-accent accent-accent size-4"
                    />
                    Exclude Similar (i, l, 1, L, o, 0, O)
                  </label>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Passphrase controls */}
              <div>
                <label className="mb-2.5 block text-sm font-medium text-primary">
                  Words Count: <span className="font-mono font-bold text-accent">{wordCount}</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="12"
                  value={wordCount}
                  onChange={(e) => setWordCount(Number(e.target.value))}
                  className="w-full accent-accent cursor-pointer"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-primary">Separator</label>
                <select
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background p-2 text-sm text-primary focus:outline-none focus:border-accent"
                >
                  <option value="-">Hyphen (-)</option>
                  <option value="_">Underscore (_)</option>
                  <option value=" ">Space ( )</option>
                  <option value=".">Period (.)</option>
                  <option value="">None</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2.5 text-sm text-secondary cursor-pointer hover:text-primary">
                  <input
                    type="checkbox"
                    checked={capitalize}
                    onChange={(e) => setCapitalize(e.target.checked)}
                    className="rounded text-accent focus:ring-accent accent-accent size-4"
                  />
                  Capitalize Words
                </label>

                <label className="flex items-center gap-2.5 text-sm text-secondary cursor-pointer hover:text-primary">
                  <input
                    type="checkbox"
                    checked={includeNumber}
                    onChange={(e) => setIncludeNumber(e.target.checked)}
                    className="rounded text-accent focus:ring-accent accent-accent size-4"
                  />
                  Include Number
                </label>
              </div>
            </>
          )}
        </div>

        {/* Output & Strength Display */}
        <div className="space-y-5 md:col-span-2">
          {/* Main Password Box */}
          <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
            <label className="block text-sm font-medium text-primary">Generated Password</label>
            <div className="relative flex items-center">
              <input
                readOnly
                value={password}
                placeholder="Click generate to create password"
                className="w-full rounded-xl border border-border bg-background p-4 pr-24 font-mono text-base text-primary outline-none focus:border-accent/50 selection:bg-accent/30"
              />

              <div className="absolute right-3 flex items-center gap-1.5">
                <button
                  onClick={generatePassword}
                  className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-elevated transition-colors group"
                  title="Regenerate"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-hover:rotate-180 duration-500"
                  >
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                  </svg>
                </button>
                {password && (
                  <CopyButton
                    value={password}
                    className="bg-background text-xs py-1.5 px-3"
                  />
                )}
              </div>
            </div>

            {/* Strength indicator */}
            {password && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-secondary">Password Strength:</span>
                  <span className={`text-xs font-bold text-primary`}>{strengthDetails.label}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index <= strengthScore ? strengthDetails.color : "bg-elevated"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick tips or warning */}
          <div className="rounded-xl border border-border bg-surface/50 p-5">
            <h4 className="text-sm font-semibold text-primary mb-1">🔒 Security Recommendation</h4>
            <p className="text-xs text-secondary leading-relaxed">
              DevToolsHub password generator is built completely client-side. Your password is generated right in your browser, meaning it is never transmitted over the internet or sent to any server. We recommend using passwords of at least 12 characters with mixed letters, numbers, and symbols.
            </p>
          </div>
        </div>
      </div>

      <ToolActions>
        <Button variant="primary" onClick={generatePassword}>
          Generate Password
        </Button>
      </ToolActions>
    </div>
  );
}