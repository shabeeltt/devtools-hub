import { useState } from "react";
import ToolTextarea from "../../components/tool/ToolTextarea";
import CopyButton from "../../ui/CopyButton";
import ToolActions from "../../components/tool/ToolActions";
import Button from "../../ui/Button";
import SampleButton from "../../ui/SampleButton";

// ── SQL keywords ──────────────────────────────────────────────────────────────

const KEYWORDS = [
  "SELECT", "DISTINCT", "FROM", "WHERE", "AND", "OR", "NOT",
  "JOIN", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN",
  "CROSS JOIN", "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "FULL OUTER JOIN",
  "ON", "AS", "IN", "BETWEEN", "LIKE", "IS", "NULL", "EXISTS",
  "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET",
  "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "DELETE",
  "CREATE TABLE", "ALTER TABLE", "DROP TABLE", "TRUNCATE TABLE",
  "CREATE INDEX", "DROP INDEX", "CREATE VIEW", "DROP VIEW",
  "UNION", "UNION ALL", "INTERSECT", "EXCEPT",
  "CASE", "WHEN", "THEN", "ELSE", "END",
  "WITH", "RECURSIVE", "OVER", "PARTITION BY",
  "ROW_NUMBER", "RANK", "DENSE_RANK", "COUNT", "SUM", "AVG", "MIN", "MAX",
  "COALESCE", "NULLIF", "CAST", "CONVERT",
  "PRIMARY KEY", "FOREIGN KEY", "REFERENCES", "UNIQUE", "NOT NULL",
  "DEFAULT", "CHECK", "CONSTRAINT", "INDEX",
  "EXPLAIN", "ANALYZE", "VACUUM", "COMMIT", "ROLLBACK", "BEGIN",
  "TRANSACTION", "SAVEPOINT", "RELEASE",
  "ASC", "DESC", "NULLS FIRST", "NULLS LAST",
];

// Clauses that always get their own new line
const NEWLINE_BEFORE = [
  "SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING",
  "LIMIT", "OFFSET", "UNION", "UNION ALL", "INTERSECT", "EXCEPT",
  "INNER JOIN", "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "FULL OUTER JOIN",
  "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "CROSS JOIN", "JOIN",
  "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM",
  "CREATE TABLE", "ALTER TABLE", "DROP TABLE",
  "WITH", "ON",
];

// ── formatter logic ───────────────────────────────────────────────────────────

function capitalizeKeywords(sql: string): string {
  // Sort longest first so "GROUP BY" matches before "BY"
  const sorted = [...KEYWORDS].sort((a, b) => b.length - a.length);
  const pattern = sorted.map((k) => k.replace(/\s+/g, "\\s+")).join("|");
  const regex = new RegExp(`\\b(${pattern})\\b`, "gi");
  return sql.replace(regex, (match) => match.toUpperCase());
}

function formatSql(raw: string): string {
  // 1. Normalize whitespace (collapse newlines & multiple spaces)
  let sql = raw.replace(/\s+/g, " ").trim();

  // 2. Uppercase keywords
  sql = capitalizeKeywords(sql);

  // 3. Inject newlines before top-level clauses
  const sorted = [...NEWLINE_BEFORE].sort((a, b) => b.length - a.length);
  const clausePattern = sorted.map((k) => k.replace(/\s+/g, "\\s+")).join("|");
  const clauseRegex = new RegExp(`\\b(${clausePattern})\\b`, "g");
  sql = sql.replace(clauseRegex, "\n$1");

  // 4. Indent SELECT column list — each comma-separated item on its own line
  sql = sql.replace(/^SELECT\s+/m, "SELECT\n  ");
  sql = sql.replace(/,\s*(?=[^()]*(?:\((?:[^()]*\([^()]*\))*[^()]*\))*[^()]*$)/g, ",\n  ");

  // 5. Indent AND / OR inside WHERE / HAVING / ON
  sql = sql.replace(/\b(AND|OR)\b/g, "\n  $1");

  // 6. Clean up: remove leading whitespace on blank lines, trim each line
  const lines = sql
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l, i, arr) => !(l === "" && arr[i - 1] === ""));

  // 7. Add 2-space indent after clause keywords
  const indentedLines = lines.map((line, i) => {
    if (i === 0) return line;
    const trimmed = line.trimStart();
    const isClause = NEWLINE_BEFORE.some(
      (k) => trimmed.toUpperCase().startsWith(k)
    );
    return isClause ? line : "  " + trimmed;
  });

  // Re-de-indent top-level clauses (they got double-indented in step above)
  const finalLines = indentedLines.map((line) => {
    const trimmed = line.trim();
    const isClause = NEWLINE_BEFORE.some(
      (k) => trimmed.toUpperCase() === k || trimmed.toUpperCase().startsWith(k + " ")
    );
    return isClause ? trimmed : line;
  });

  return finalLines.join("\n").trim();
}

// ── sample query ──────────────────────────────────────────────────────────────

const SAMPLE_SQL =
  "select u.id, u.name, o.total from users u inner join orders o on u.id = o.user_id where u.active = 1 and o.total > 100 group by u.id, u.name order by o.total desc limit 25";

// ── component ─────────────────────────────────────────────────────────────────

export default function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const hasInput = input.trim().length > 0;
  const hasOutput = output.length > 0;

  function handleFormat() {
    setError("");
    try {
      setOutput(formatSql(input));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Formatting failed.");
      setOutput("");
    }
  }

  function loadSample() {
    setInput(SAMPLE_SQL);
    setOutput(formatSql(SAMPLE_SQL));
    setError("");
  }

  function clear() {
    setInput("");
    setOutput("");
    setError("");
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <ToolTextarea
          label="Input SQL"
          value={input}
          onChange={(v) => {
            setInput(v);
            setError("");
          }}
          placeholder="Paste raw SQL query here (e.g. select id, name from users where active = 1)"
          rows={16}
          rightLabel={<SampleButton onClick={loadSample} />}
        />

        <ToolTextarea
          label="Formatted SQL"
          value={error || output}
          readOnly
          rows={16}
          textColor={error ? "default" : "accent"}
        >
          {hasOutput && !error && (
            <CopyButton value={output} className="absolute right-4 top-4" />
          )}
        </ToolTextarea>
      </div>

      <ToolActions>
        <Button
          variant="primary"
          onClick={handleFormat}
          isDisabled={!hasInput}
        >
          Format SQL
        </Button>

        {(hasOutput || error) && (
          <Button variant="secondary" onClick={clear}>
            Clear
          </Button>
        )}
      </ToolActions>
    </div>
  );
}
