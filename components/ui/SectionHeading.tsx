import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
      <h2 className="mb-4">{title}</h2>
      {lead ? (
        <p className={cn("section-lead", align === "center" && "mx-auto")}>{lead}</p>
      ) : null}
    </div>
  );
}
