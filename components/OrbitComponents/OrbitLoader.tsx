export const OrbitLoader: React.FC<{
  variant?: "spinner" | "dots" | "pulse";
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ variant = "spinner", size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  if (variant === "dots") {
    return (
      <div className={`flex gap-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`bg-black rounded-full animate-bounce ${size === "sm" ? "w-1 h-1" : size === "md" ? "w-2 h-2" : "w-3 h-3"}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div
        className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}
      >
        <div className="absolute inset-0 bg-black/20 rounded-full animate-ping" />
        <div className="relative w-full h-full bg-black rounded-full" />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} border-2 border-black/10 border-t-black rounded-full animate-spin ${className}`}
    />
  );
};
