type SampleButtonProps = {
  onClick: () => void;
};

export default function SampleButton({ onClick, ...rest }: SampleButtonProps) {
  return (
    <button
      {...rest}
      onClick={onClick}
      className="text-xs text-blue-500 hover:text-blue-400"
    >
      Sample
    </button>
  );
}