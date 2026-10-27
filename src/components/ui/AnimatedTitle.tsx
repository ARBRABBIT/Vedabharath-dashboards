"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.04,
    },
  },
};

const word: Variants = {
  hidden: { opacity: 0, filter: "blur(9px)", y: 6 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

type AnimatedTitleProps = Omit<HTMLMotionProps<"h1">, "children"> & {
  children: string;
};

export function AnimatedTitle({ className = "", children, ...props }: AnimatedTitleProps) {
  const words = children.split(" ");

  const wordNodes = words
    .map((text, index) => (
      <motion.span key={index} variants={word} className="inline-block">
        {text}
      </motion.span>
    ))
    .reduce<ReactNode[]>((nodes, span, index) => {
      if (index > 0) nodes.push(" ");
      nodes.push(span);
      return nodes;
    }, []);

  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      variants={container}
      className={className}
      {...props}
    >
      {wordNodes}
    </motion.h1>
  );
}
