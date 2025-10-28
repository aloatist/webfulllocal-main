// File: components/TypingEffect.tsx
"use client";
import { useState, useEffect } from 'react';

import { cn } from "@/lib/utils";

interface TypingEffectProps {
  textToType: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

const TypingEffect = ({ textToType, as: Tag = 'h1', className }: TypingEffectProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setIndex(0);
  }, [textToType]);

  useEffect(() => {
    if (index < textToType.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((value) => value + textToType[index]);
        setIndex(index + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [index, textToType]);

  return (
    <Tag
      className={cn(
        "text-3xl font-extrabold uppercase tracking-tight text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)] sm:text-5xl",
        className,
      )}
    >
      {displayedText}
    </Tag>
  );
};

export default TypingEffect;
