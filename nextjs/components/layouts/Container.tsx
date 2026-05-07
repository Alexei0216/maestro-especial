export default function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`max-w-[1800px] max-h-md mx-auto px-5 sm:px-8 lg:px-15 w-full ${className}`}
    >
      {children}
    </div>
  );
}
