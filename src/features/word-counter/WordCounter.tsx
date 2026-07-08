import { useMemo, useState } from "react";
import ToolTextarea from "../../components/tool/ToolTextarea";
import ToolActions from "../../components/tool/ToolActions";
import Button from "../../ui/Button";

const READING_WPM = 200;
const SPEAKING_WPM = 130;

function formatMinutes(words: number, wpm: number): string {
  if (words === 0) return "0 min";
  const minutes = words / wpm;
  if (minutes < 1) return "< 1 min";
  return `${Math.ceil(minutes)} min`;
}

export default function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();

    const charsWithSpaces = text.length;
    const charsWithoutSpaces = text.replace(/\s/g, "").length;
    const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
    const sentences =
      trimmed === ""
        ? 0
        : text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean).length;
    const paragraphs =
      trimmed === ""
        ? 0
        : text.split(/\n+/).map((p) => p.trim()).filter(Boolean).length;

    return {
      charsWithSpaces,
      charsWithoutSpaces,
      words,
      sentences,
      paragraphs,
      readingTime: formatMinutes(words, READING_WPM),
      speakingTime: formatMinutes(words, SPEAKING_WPM),
    };
  }, [text]);

  const statCards = [
    { label: "Characters", value: stats.charsWithSpaces },
    { label: "Characters (no spaces)", value: stats.charsWithoutSpaces },
    { label: "Words", value: stats.words },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Reading time", value: stats.readingTime },
    { label: "Speaking time", value: stats.speakingTime },
  ];

  return (
    <div className="space-y-6">
      <ToolTextarea
        label="Text"
        value={text}
        onChange={setText}
        placeholder="Start typing or paste your text here..."
        rows={14}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-surface p-4"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              {label}
            </p>
            <p className="mt-2 text-lg font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <ToolActions>
        <Button
          onClick={() => setText("")}
          variant="secondary"
          isDisabled={text === ""}
        >
          Clear
        </Button>
      </ToolActions>
    </div>
  );
}
