import { useState } from "react";
import ToolTextarea from "../../components/tool/ToolTextarea";
import ToolActions from "../../components/tool/ToolActions";
import Button from "../../ui/Button";
import CopyButton from "../../ui/CopyButton";

export default function CssGradientGenerator() {
  const [color1, setColor1] = useState("#ff0000");
  const [color2, setColor2] = useState("#0000ff");
  const [angle, setAngle] = useState(90);

  const cssCode = `background: linear-gradient(${angle}deg, ${color1}, ${color2});`;

  const resetValues = () => {
    setColor1("#ff0000");
    setColor2("#0000ff");
    setAngle(90);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-xl border border-border bg-surface p-5">
          <div>
            <label className="mb-2 block text-sm text-secondary">
              First Color
            </label>

            <input
              type="color"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="h-12 w-full cursor-pointer rounded"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-secondary">
              Second Color
            </label>

            <input
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="h-12 w-full cursor-pointer rounded"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-secondary">
              Angle: {angle}°
            </label>

            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-secondary">
              Live Preview
            </label>

            <div
              className="h-40 w-full rounded-xl border border-border"
              style={{
                background: `linear-gradient(${angle}deg, ${color1}, ${color2})`,
              }}
            />
          </div>
        </div>

        <ToolTextarea
          label="Generated CSS"
          value={cssCode}
          readOnly
          rows={12}
          rightLabel={<CopyButton value={cssCode} />}
        />
      </div>

      <ToolActions>
        <Button variant="secondary" onClick={resetValues}>
          Reset
        </Button>
      </ToolActions>
    </div>
  );
}