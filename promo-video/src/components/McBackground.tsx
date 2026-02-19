import React from "react";
import { OffthreadVideo, staticFile } from "remotion";

interface McBackgroundProps {
  darken?: number; // 0~1, 어둡게 할 정도 (기본 0.6)
}

export const McBackground: React.FC<McBackgroundProps> = ({
  darken = 0.6,
}) => {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <OffthreadVideo
        src={staticFile("mc-bg.mov")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        muted
      />
      {/* 어둡게 오버레이 — 채팅 텍스트 가독성 확보 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: `rgba(0, 0, 0, ${darken})`,
        }}
      />
    </div>
  );
};
