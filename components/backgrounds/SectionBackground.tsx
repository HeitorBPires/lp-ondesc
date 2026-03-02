import { ReactNode } from "react";

type SectionBackgroundProps = {
  variant?: "light" | "soft";
  children: ReactNode;
  id?: string;
  className?: string;
  containerMode?: "default" | "none" | "wide";
};

export default function SectionBackground({
  variant = "light",
  children,
  id,
  className = "",
  containerMode = "default",
}: SectionBackgroundProps) {
  const containerClass =
    containerMode === "none"
      ? ""
      : containerMode === "wide"
        ? "container container-wide"
        : "container";

  return (
    <section
      id={id}
      className={`section-block section-${variant} ${className}`.trim()}
    >
      {containerClass ? <div className={containerClass}>{children}</div> : children}
    </section>
  );
}
