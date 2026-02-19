"use client";

import { useEffect, useState } from "react";

interface MinecraftToastProps {
  show: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

export default function MinecraftToast({
  show,
  title,
  description,
  onClose,
}: MinecraftToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 500);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !visible) return null;

  return (
    <div
      className={`
        fixed top-6 right-6 z-50
        flex items-center gap-4 p-4
        bg-[#3a3a3a] border-2 border-[#1a1a1a]
        border-t-[#6a6a6a] border-l-[#6a6a6a]
        shadow-[4px_4px_0_rgba(0,0,0,0.5)]
        transition-all duration-500
        ${visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
      `}
    >
      {/* 마크 도전과제 아이콘 (픽셀 다이아몬드) */}
      <div className="w-10 h-10 bg-mc-aqua/20 border border-mc-aqua/40 flex items-center justify-center flex-shrink-0">
        <span className="text-xl">💎</span>
      </div>
      <div>
        <p className="text-mc-yellow font-pixel text-xs tracking-wide">
          {title}
        </p>
        <p className="text-white font-pixel text-sm mt-0.5">{description}</p>
      </div>
    </div>
  );
}
