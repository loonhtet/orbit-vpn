import { OrbitLoader } from "./OrbitLoader";
import { OrbitComponentProps } from "./type";

export const OrbitButton: React.FC<
  OrbitComponentProps & {
    variant?: "solid" | "outline" | "ghost";
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    size?: "sm" | "md" | "lg";
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
  }
> = ({
  children,
  className = "",
  theme,
  variant = "solid",
  onClick,
  disabled,
  loading,
  size = "md",
  iconLeft,
  iconRight,
}) => {
  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-3 text-xs",
    lg: "px-8 py-4 text-sm",
  };
  const baseStyles = `cursor-pointer transition-all duration-150 active:translate-y-[1px] active:translate-x-[0.5px] font-mono-orbit font-bold uppercase tracking-widest border rounded-2xl disabled:opacity-50 inline-flex items-center justify-center gap-3 ${sizes[size]}`;
  const variants = {
    solid: `bg-black text-white border-black`,
    outline: `bg-white text-black border-black hover:${theme?.primary || "bg-slate-100"}`,
    ghost: `bg-transparent text-black border-transparent hover:border-black`,
  };

  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <OrbitLoader
          variant="spinner"
          size="sm"
          className={
            variant === "solid" ? "border-t-white border-white/30" : ""
          }
        />
      ) : (
        <>
          {iconLeft}
          {children}
          {iconRight}
        </>
      )}
    </button>
  );
};
