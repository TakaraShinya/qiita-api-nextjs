"use client";

import { motion, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface TooltipProps {
  image: string;
  name: string;
}

export const AnimatedTooltip = ({ image, name }: TooltipProps) => {
  const [hovered, setHovered] = useState(false);
  const springConfig = { damping: 5, stiffness: 100 };
  const x = useMotionValue(0); // going to set this value on mouse move
  // rotate the tooltip
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  // translate the tooltip
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);
  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
  };

  return (
    <Link
      className="z-100 group relative "
      href={`https://qiita.com/${name}`}
      key={name}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      target="_blank"
    >
      <AnimatePresence mode="popLayout">
        {hovered && (
          <motion.div
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                damping: 10,
                stiffness: 260,
                type: "spring",
              },
              y: 0,
            }}
            className="absolute -left-1/3 -top-16 z-50 flex translate-x-1/2  flex-col items-center justify-center rounded-md bg-black px-6 py-3 text-sm shadow-xl"
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            style={{
              rotate: rotate,
              translateX: translateX,
              whiteSpace: "nowrap",
            }}
          >
            <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent " />
            <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent " />
            <div className="relative z-30 text-lg font-bold text-white">Welcome to {name}!!</div>
          </motion.div>
        )}
      </AnimatePresence>
      <Image
        alt={name}
        className="relative !m-0 h-14 w-14 rounded-full border-2 border-white object-cover object-top !p-0 transition  duration-500 group-hover:z-30 group-hover:scale-125"
        height={100}
        onMouseMove={handleMouseMove}
        src={image}
        width={100}
      />
    </Link>
  );
};
