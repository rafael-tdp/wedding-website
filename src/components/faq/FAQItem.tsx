"use client";

import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export default function FAQItem({
  question,
  answer,
  defaultOpen = false,
}: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-primary/10 rounded-lg overflow-hidden bg-background-soft mb-3">
      {/* Question - Clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-3 sm:p-6 flex items-start justify-between gap-2 sm:gap-4 hover:bg-background-soft transition-colors"
      >
        <h3 className="text-sm sm:text-lg font-serif text-foreground pr-2">{question}</h3>
        <svg
          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Réponse - Collapsible */}
      <div
        className={`overflow-hidden transition-all duration-300 bg-white/50
          ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-3 sm:px-6 py-3 sm:py-6 border-t border-primary/10">
          <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed whitespace-pre-wrap">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
