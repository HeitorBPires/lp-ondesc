import { ReactNode } from "react";

type GradientBackgroundProps = {
  children: ReactNode;
};

export default function GradientBackground({
  children,
}: GradientBackgroundProps) {
  return (
    <div className="gradient-bg">
      <div className="gradient-decor" aria-hidden="true">
        <div className="pattern-dots" />
        <div className="blob blob-a" />
        <div className="blob blob-b" />
        <div className="blob blob-c" />
      </div>
      <div className="gradient-content">{children}</div>
    </div>
  );
}
