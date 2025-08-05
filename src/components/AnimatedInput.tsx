// src/components/AnimatedInput.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";

interface AnimatedInputProps {
  label: string;
  placeholder?: string;
  onSubmit: (val: string) => void;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({ label, placeholder, onSubmit }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (inputValue.trim() === "") return;
    onSubmit(inputValue);
  };

  return (
    <div className="w-full max-w-md">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold mb-4 text-center"
      >
        {label}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-3"
      >
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          className="self-center px-5 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
        >
          Next
        </button>
      </motion.div>
    </div>
  );
};

export default AnimatedInput;
