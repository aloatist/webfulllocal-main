/**
 * FAQ Schema for SEO
 * Helps appear in Google's FAQ rich results
 */

'use client';

import { useState } from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQItem[];
  heading?: string;
}

export function FAQSchema({ items }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Visual FAQ Component with Schema
 */
export function FAQ({ items, heading }: FAQSchemaProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      <FAQSchema items={items} />
      {heading && (
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {heading}
        </h2>
      )}
      <div className="space-y-4">
        {items.map((item, index) => {
          const isOpen = openIndices.has(index);
          // Use a more stable key combining index and question text
          const itemKey = `faq-${index}-${item.question?.substring(0, 20) || index}`;
          return (
            <div
              key={itemKey}
              className="rounded-lg border border-border bg-background/50 p-4 transition-colors hover:bg-background/80"
            >
              <button
                type="button"
                onClick={() => toggleItem(index)}
                className="w-full cursor-pointer font-medium text-foreground hover:text-primary transition-colors flex items-center justify-between gap-4 text-left"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="flex-1">{item.question}</span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[1000px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
                }`}
              >
                <div className="text-muted-foreground leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
