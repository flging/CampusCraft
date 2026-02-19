import React from "react";
import { Composition } from "remotion";
import { CampusCraftPromo } from "./compositions/CampusCraftPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CampusCraftPromo"
      component={CampusCraftPromo}
      durationInFrames={630}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
