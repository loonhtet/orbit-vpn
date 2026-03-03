"use client";
import { useRef, useState } from "react";
import { OrbitIcons } from "./OrbitIcons";
import { OrbitComponentProps } from "./type";

export const OrbitInput: React.FC<
  OrbitComponentProps & {
    type?: "text" | "password" | "email" | "number" | "search" | "tel" | "url";
    placeholder?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    label?: string;
    error?: string;
    min?: number;
    max?: number;
    step?: number;
  }
> = ({
  className = "",
  type = "text",
  placeholder,
  value,
  onChange,
  leftIcon,
  rightIcon,
  label,
  error,
  min,
  max,
  step = 1,
}) => {
  const [showPass, setShowPass] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getCurrentValue = () => {
    if (!inputRef.current) return 0;
    return parseFloat(inputRef.current.value) || 0;
  };

  const handleStep = (direction: 1 | -1) => {
    if (inputRef.current) {
      const currentVal = getCurrentValue();
      let newVal = currentVal + step * direction;
      newVal = Math.round(newVal * 100) / 100;

      if (min !== undefined && newVal < min) newVal = min;
      if (max !== undefined && newVal > max) newVal = max;

      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;
      nativeSetter?.call(inputRef.current, newVal);
      const event = new Event("input", { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  };

  const isPassword = type === "password";
  const inputType = isPassword ? (showPass ? "text" : "password") : type;

  const getPaddingRight = () => {
    if (type === "number") return "pr-24";
    if (isPassword || rightIcon) return "pr-10";
    return "px-4";
  };

  const currentVal =
    typeof value === "number" ? value : parseFloat(String(value)) || 0;
  const isMin = min !== undefined && currentVal <= min;
  const isMax = max !== undefined && currentVal >= max;

  return (
    <div className={`w-full group ${className}`}>
      {label && (
        <label className="block mb-2 font-mono-orbit font-bold text-[9px] uppercase tracking-widest text-black ml-1">
          {label}
        </label>
      )}
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black pointer-events-none transition-transform group-focus-within:scale-110">
            {leftIcon}
          </div>
        )}

        <input
          ref={inputRef}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={`w-full ${leftIcon ? "pl-11" : "px-4"} ${getPaddingRight()} py-3 border border-black rounded-2xl outline-none font-bold text-sm placeholder:text-silent bg-white transition-all focus:bg-slate-50 focus:ring-2 ring-black/5 ${error ? "border-red-500 bg-red-50" : ""}`}
        />

        <div className="absolute right-0 top-0 h-full flex items-center z-10 pointer-events-none">
          {isPassword && (
            <div className="pointer-events-auto flex items-center pr-3">
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="p-2 rounded-xl hover:bg-black/5 text-silent hover:text-black transition-all active:scale-95 flex items-center justify-center"
                tabIndex={-1}
              >
                {showPass ? (
                  <OrbitIcons.EyeOff size={18} />
                ) : (
                  <OrbitIcons.Eye size={18} />
                )}
              </button>
            </div>
          )}

          {type === "number" && (
            <div className="flex h-full border-l border-black pointer-events-auto overflow-hidden rounded-r-2xl">
              <button
                type="button"
                onClick={() => handleStep(-1)}
                disabled={isMin}
                className="w-10 h-full hover:bg-black hover:text-white border-r border-black active:scale-95 transition-all flex items-center justify-center disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-black disabled:cursor-not-allowed"
                tabIndex={-1}
              >
                <OrbitIcons.Minus size={14} strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => handleStep(1)}
                disabled={isMax}
                className="w-10 h-full hover:bg-black hover:text-white active:scale-95 transition-all flex items-center justify-center disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-black disabled:cursor-not-allowed"
                tabIndex={-1}
              >
                <OrbitIcons.Plus size={14} strokeWidth={2} />
              </button>
            </div>
          )}

          {!["password", "number"].includes(type) && rightIcon && (
            <div className="w-12 text-silent flex items-center justify-center h-full pointer-events-none pr-2">
              {rightIcon}
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-2 mt-2 ml-1 animate-in slide-in-from-left-1">
          <OrbitIcons.Info size={12} className="text-red-500" />
          <p className="text-[9px] font-mono-orbit font-bold text-red-500 uppercase tracking-widest">
            {error}
          </p>
        </div>
      )}
    </div>
  );
};
