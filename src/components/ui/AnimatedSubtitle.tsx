"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

type AnimatedSubtitleProps = HTMLMotionProps<"p">;

export function AnimatedSubtitle({ className = "", children, ...props }: AnimatedSubtitleProps) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.p>
  );
}
