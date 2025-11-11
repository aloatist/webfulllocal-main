"use client";

import Image from "next/image";
import { useState } from "react";

// Fallback image URL
const FALLBACK_IMAGE = "/uploads/anhbiadulichconphung.webp";

// Image component with error handling
export function PlaceImage({ src, alt, hint }: { src: string; alt: string; hint: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== FALLBACK_IMAGE) {
      setHasError(true);
      setImgSrc(FALLBACK_IMAGE);
    }
  };

  // Use regular img tag for external URLs to have better error handling
  // Use Next.js Image for local images
  const isExternal = imgSrc.startsWith("https://") || imgSrc.startsWith("http://");

  if (isExternal) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imgSrc}
        alt={alt}
        className="object-cover absolute inset-0 w-full h-full"
        data-ai-hint={hint}
        onError={handleError}
        loading="lazy"
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover"
      data-ai-hint={hint}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  );
}

