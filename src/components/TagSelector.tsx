// src/components/TagSelector.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";

interface TagSelectorProps {
  label: string;
  suggestions: string[];
  onChange: (selected: string[]) => void;
  onNext: () => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ label, suggestions, onChange, onNext }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const isSelected = prev.includes(tag);
      const updated = isSelected ? prev.filter((t) => t !== tag) : [...prev, tag];
      onChange(updated);
      return updated;
    });
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold mb-6 text-center"
      >
        {label}
      </motion.h2>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {suggestions.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-4 py-2 rounded-full border transition shadow-sm ${
              selectedTags.includes(tag)
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={selectedTags.length === 0}
        className={`px-6 py-3 rounded-xl font-semibold transition ${
          selectedTags.length > 0
            ? "bg-indigo-600 text-white hover:bg-indigo-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default TagSelector;
