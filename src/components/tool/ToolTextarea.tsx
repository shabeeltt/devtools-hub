type ToolTextareaProps = {
  label?: React.ReactNode;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  readOnly?: boolean;
  rightLabel?: React.ReactNode; // e.g. Sample button
  children?: React.ReactNode; // overlay (copy button)
  textColor?: "default" | "accent";
};

export default function ToolTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 6,
  readOnly = false,
  rightLabel,
  children,
  textColor = "default",
}: ToolTextareaProps) {
  return (
    <div className="space-y-2 w-full">
      {(label || rightLabel) && (
        <div className="flex justify-between">
          <label className="text-sm text-neutral-400">{label}</label>
          {rightLabel}
        </div>
      )}

      <div className="relative">
        <textarea
          rows={rows}
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className={`custom-scrollbar w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 font-mono text-sm outline-none focus:border-blue-500/50 ${
            textColor === "accent" ? "text-blue-400" : "text-white"
          }`}
        />
            {children}
      </div>
    </div>
  );
}
