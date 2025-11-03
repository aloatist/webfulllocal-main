/**
 * FAQ Schema for SEO
 * Helps appear in Google's FAQ rich results
 */

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQItem[];
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
export function FAQ({ items }: FAQSchemaProps) {
  return (
    <div className="space-y-6">
      <FAQSchema items={items} />
      <h2 className="text-2xl font-bold">Câu hỏi thường gặp</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <details
            key={index}
            className="group rounded-lg border border-border bg-background/50 p-4"
          >
            <summary className="cursor-pointer font-medium text-foreground hover:text-primary transition-colors list-none flex items-center justify-between">
              <span>{item.question}</span>
              <svg
                className="w-5 h-5 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
