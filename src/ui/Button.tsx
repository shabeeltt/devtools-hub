type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  isDisabled?: boolean;
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  isDisabled = false,
  ...rest
}: ButtonProps) {
  const base =
    "rounded-full px-6 py-2 font-semibold transition-all active:scale-95";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20",
    secondary:
      "rounded-full bg-neutral-600 font-semibold text-white hover:bg-neutral-700 hover:shadow-lg hover:shadow-neutral-500/20",
  };

  const disabledStyles = "bg-neutral-700 cursor-not-allowed opacity-50";

  return (
    <button
      {...rest}  
      onClick={onClick}
      disabled={isDisabled}
      className={`${base} ${isDisabled ? disabledStyles : variants[variant]}`}
      type="button"
    >
      {children}
    </button>
  );
}
