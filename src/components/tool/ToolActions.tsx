type ToolActionsProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ToolActions({ children, className = "" }: ToolActionsProps) {
  return (
    <div className={` ${className} flex flex-col justify-center gap-4 sm:flex-row`}>
      {children}
    </div>
  );
}