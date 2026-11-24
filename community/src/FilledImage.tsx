type FilledImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill: boolean;
};

export function FilledImage({ src, alt, className, priority }: FilledImageProps) {
  return (
    <img src={src} alt={alt} className={className}
      loading={priority ? "eager" : "lazy"} decoding="async"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
  );
}
