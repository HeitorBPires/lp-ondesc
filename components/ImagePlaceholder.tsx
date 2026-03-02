"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image, { ImageProps } from "next/image";

type ImagePlaceholderProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  priority?: boolean;
  loading?: ImageProps["loading"]; // "eager" | "lazy"
  sizes?: string;
};

export default function ImagePlaceholder({
  src,
  alt,
  className,
  fallbackLabel = "Imagem placeholder",
  priority = false,
  loading,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: ImagePlaceholderProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const didUnmountRef = useRef(false);

  useEffect(() => {
    return () => {
      didUnmountRef.current = true;
    };
  }, []);

  // Evita piscar skeleton quando a mesma imagem reaparece
  const key = useMemo(() => src, [src]);

  if (failed) {
    return (
      <div
        className={`image-placeholder ${className ?? ""}`}
        role="img"
        aria-label={alt}
      >
        <span>{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <div className={`image-frame ${className ?? ""}`}>
      {/* Skeleton leve enquanto carrega */}
      {!loaded && <div className="image-skeleton" aria-hidden="true" />}

      <Image
        key={key}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`cover-image ${loaded ? "is-loaded" : ""}`}
        priority={priority}
        loading={loading}
        onError={() => {
          if (!didUnmountRef.current) {
            setFailed(true);
          }
        }}
        onLoad={() => {
          if (!didUnmountRef.current) {
            setLoaded(true);
          }
        }}
      />
    </div>
  );
}
