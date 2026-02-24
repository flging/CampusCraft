import React from "react";
import { Composition } from "remotion";
import { CampusCraftPromo } from "./compositions/CampusCraftPromo";
import { CampusCraftShorts } from "./compositions/CampusCraftShorts";
import { CampusCraftCinematic } from "./compositions/CampusCraftCinematic";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CampusCraftCinematic"
        component={CampusCraftCinematic}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CampusCraftShorts"
        component={CampusCraftShorts}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CampusCraftPromo"
        component={CampusCraftPromo}
        durationInFrames={630}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
