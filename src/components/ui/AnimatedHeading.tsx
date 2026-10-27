"use client";

import { motion, type Variants } from "framer-motion";
import { useMemo, type ElementType, type ReactNode } from "react";

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.08,
    },
  },
};

const word: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)", y: 4 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

type AnimatedHeadingProps = {
  as?: ElementType;
  className?: string;
  children: string;
};

export function AnimatedHeading({ as = "h3", className = "", children }: AnimatedHeadingProps) {
  const Tag = useMemo(() => motion.create(as), [as]);
  const words = children.split(" ");

  return (
    <Tag initial="hidden" animate="visible" variants={container} className={className}>
      {words.map((text, index) => (
        <motion.span key={index} variants={word} className="inline-block">
          {text}
        </motion.span>
      )).reduce<ReactNode[]>((nodes, span, index) => {
        if (index > 0) nodes.push(" ");
        nodes.push(span);
        return nodes;
      }, [])}
    </Tag>
  );
}
