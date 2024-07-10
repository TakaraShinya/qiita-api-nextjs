"use client";
import { useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

import { Card, Header } from "components/ui/container-scroll-animation";

type DEVISE_TYPE = "DESKTOP" | "LAPTOP" | "MOBILE" | "TABLET";
const decideDevice = (innerWidth: number): DEVISE_TYPE => {
  const config = {
    desktop: {
      name: "DESKTOP" as DEVISE_TYPE,
      size: 1600 as number,
    },
    laptop: {
      name: "LAPTOP" as DEVISE_TYPE,
      size: 1024 as number,
    },
    mobile: {
      name: "MOBILE" as DEVISE_TYPE,
      size: 0 as number,
    },
    tablet: {
      name: "TABLET" as DEVISE_TYPE,
      size: 768 as number,
    },
  };

  if (innerWidth >= config.desktop.size) return config.desktop.name;
  if (innerWidth >= config.laptop.size) return config.laptop.name;
  if (innerWidth >= config.tablet.size) return config.tablet.name;
  return config.mobile.name;
};

export const ItemContainerScroll = ({
  titleComponent,
  children,
}: {
  children: React.ReactNode;
  titleComponent: string | React.ReactNode;
}) => {
  const containerRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [deviseType, setDeviceType] = React.useState<DEVISE_TYPE>("DESKTOP" as DEVISE_TYPE);

  React.useEffect(() => {
    const deviseType = decideDevice(window.innerWidth);

    const checkDevise = () => {
      setDeviceType(deviseType);
    };
    checkDevise();
    window.addEventListener("resize", checkDevise);
    return () => {
      window.removeEventListener("resize", checkDevise);
    };
  }, []);

  const rotateDimensions = () => {
    if (deviseType === "DESKTOP") return [75, 0];
    if (deviseType === "LAPTOP") return [75, 0];
    if (deviseType === "TABLET") return [75, 0];

    return [0.7, 0.9];
  };

  const scaleDimensions = () => {
    if (deviseType === "DESKTOP") return [1.05, 1];
    if (deviseType === "LAPTOP") return [1.05, 1];
    if (deviseType === "TABLET") return [1.05, 1];

    return [0.7, 0.9];
  };

  const headerTranslateDimensions = () => {
    if (deviseType === "DESKTOP") return [0, 75];
    if (deviseType === "LAPTOP") return [0, 75];
    if (deviseType === "TABLET") return [0, 75];

    return [0.7, 0.9];
  };

  const cardTranslateDimensions = () => {
    if (deviseType === "DESKTOP") return [0, 20];
    if (deviseType === "LAPTOP") return [0, 200];
    if (deviseType === "TABLET") return [0, 200];

    return [0, 200];
  };

  const HeightDimensions = () => {
    if (deviseType === "DESKTOP") return ["100svh", "50svh"];
    if (deviseType === "LAPTOP") return ["100svh", "50svh"];
    if (deviseType === "TABLET") return ["100svh", "50svh"];

    return ["100svh", "50svh"];
  };

  // NOTE: const rotate = useTransform(scrollYProgress, [0, 変更スピード(0だと角度が変わらない)], [最初の角度, 最終的な角度]);
  const rotate = useTransform(scrollYProgress, [0, 1], rotateDimensions());
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const headerTranslate = useTransform(scrollYProgress, [0, 1], headerTranslateDimensions());
  const cardTranslate = useTransform(scrollYProgress, [0, 1], cardTranslateDimensions());

  const height = useTransform(scrollYProgress, [0, 1], HeightDimensions());
  const headerStyle = {
    motionDiv: {
      alignItems: "center",
      display: "flex",
      flex: "relative",
      height,
      justifyContent: "center",
    },
  };
  const cardStyle = {
    motionDiv: {
      height: "75svh",
    },
  };

  return (
    <div
      className="relative flex h-full items-center justify-center p-2 md:mb-12 md:p-20"
      ref={containerRef}
    >
      <div
        className="relative w-full py-10 md:pb-0 md:pt-40"
        style={{
          perspective: "1000px",
        }}
      >
        <Header style={headerStyle} titleComponent={titleComponent} translate={headerTranslate} />
        <Card rotate={rotate} scale={scale} style={cardStyle} translate={cardTranslate}>
          {children}
        </Card>
      </div>
    </div>
  );
};
