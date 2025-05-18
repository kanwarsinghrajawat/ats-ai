"use client";

import { suggestions } from "@/constants";
import React from "react";

interface SuggestionsProps {
  onSelect: (suggestion: string) => void;
}

const Suggestions: React.FC<SuggestionsProps> = ({ onSelect }) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto px-8 py-16">
      <div className="relative w-full backdrop-blur-md bg-gray-900/40 border border-gray-800/50 rounded-2xl p-10 shadow-2xl overflow-hidden">
        <h2 className="text-center text-2xl font-light tracking-wide text-white/90 mb-8">
          <span className="font-extralight">Try Something like:</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {suggestions.map((sug) => (
            <button
              key={sug}
              onClick={() => onSelect(sug)}
              className="px-6 py-3 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800/50 shadow-lg text-sm font-medium text-gray-200 hover:text-white transition"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
