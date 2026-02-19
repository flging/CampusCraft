"use client";

import { ButtonHTMLAttributes } from "react";

interface MinecraftButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "stone" | "green";
  size?: "sm" | "md" | "lg";
}

export default function MinecraftButton({
  children,
  variant = "stone",
  size = "md",
  className = "",
  disabled,
  ...props
}: MinecraftButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-8 py-3 text-base",
    lg: "px-12 py-4 text-lg",
  };

  const variantClasses = {
    stone: `
      bg-gradient-to-b from-[#6d6d6d] via-[#4a4a4a] to-[#4a4a4a]
      border-t-[3px] border-l-[3px] border-[#8a8a8a]
      border-b-[3px] border-r-[3px] border-b-[#1a1a1a] border-r-[#1a1a1a]
      hover:from-[#7d7d7d] hover:via-[#5a5a5a] hover:to-[#5a5a5a]
      active:from-[#3a3a3a] active:via-[#4a4a4a] active:to-[#5a5a5a]
      active:border-t-[#1a1a1a] active:border-l-[#1a1a1a]
      active:border-b-[#8a8a8a] active:border-r-[#8a8a8a]
    `,
    green: `
      bg-gradient-to-b from-[#4a7d2e] via-[#3a6d1e] to-[#3a6d1e]
      border-t-[3px] border-l-[3px] border-[#6aad3e]
      border-b-[3px] border-r-[3px] border-b-[#1a3a0a] border-r-[#1a3a0a]
      hover:from-[#5a8d3e] hover:via-[#4a7d2e] hover:to-[#4a7d2e]
      active:from-[#2a5d0e] active:via-[#3a6d1e] active:to-[#4a7d2e]
      active:border-t-[#1a3a0a] active:border-l-[#1a3a0a]
      active:border-b-[#6aad3e] active:border-r-[#6aad3e]
    `,
  };

  return (
    <button
      className={`
        font-pixel text-white tracking-wider
        transition-all duration-100 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      style={{
        textShadow: "2px 2px 0px rgba(0, 0, 0, 0.5)",
        imageRendering: "pixelated",
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
