// src/components/PathwayConnector.tsx
import React from "react";
import { motion } from "framer-motion";

const PathwayConnector: React.FC = () => {
  return (
    <motion.div
      className="flex flex-col items-center my-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Line */}
      <motion.div
        className="w-1 bg-indigo-300"
        style={{ height: "40px" }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Dot */}
      <motion.div
        className="w-4 h-4 rounded-full bg-indigo-500 mt-1 shadow"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
    </motion.div>
  );
};

export default PathwayConnector;
