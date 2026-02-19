"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface MinecraftInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const MinecraftInput = forwardRef<HTMLInputElement, MinecraftInputProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`
            w-full px-4 py-3
            bg-black/80 text-white font-pixel text-sm
            border-2 border-[#555555]
            border-t-[#1a1a1a] border-l-[#1a1a1a]
            outline-none
            focus:border-mc-green/60 focus:shadow-[0_0_10px_rgba(85,255,85,0.3)]
            placeholder:text-[#555555]
            transition-all duration-200
            ${error ? "border-mc-red/60 shadow-[0_0_10px_rgba(255,85,85,0.3)]" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-mc-red text-xs font-pixel">{error}</p>
        )}
      </div>
    );
  }
);

MinecraftInput.displayName = "MinecraftInput";

export default MinecraftInput;
