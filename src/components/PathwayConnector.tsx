// src/components/PathwayConnector.tsx
import React from "react";
import { motion } from "framer-motion";

interface PathwayConnectorProps {
  direction: "left" | "right";
}

const PathwayConnector: React.FC<PathwayConnectorProps> = ({ direction }) => {
  const pathD =
    direction === "right"
      ? "M40 0 V40 Q40 60 60 60 H80"
      : "M40 0 V40 Q40 60 20 60 H0";
  const circleCx = direction === "right" ? 80 : 0;

  return (
    <motion.svg
      width="80"
      height="60"
      className="text-indigo-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.path
        d={pathD}
        fill="none"
        stroke="#a5b4fc"
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.circle
        cx={circleCx}
        cy={60}
        r={4}
        fill="#6366f1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      />
    </motion.svg>
  );
};

export default PathwayConnector;
