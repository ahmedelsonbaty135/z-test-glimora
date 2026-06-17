"use client";

import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  variant = "light",
  size = "md",
}: {
  className?: string;
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };
  return (
    <span
      className={cn(
        "font-brand inline-flex items-center gap-1 select-none",
        sizes[size],
        className
      )}
      aria-label="GLIMOKA"
    >
      <span className="sr-only">GLIMOKA</span>
      <span
        aria-hidden
        className={cn(
          "tracking-[0.18em] font-semibold",
          variant === "light" ? "text-rose-gold" : "text-burgundy"
        )}
      >
        GLIMOK
      </span>
      <span
        aria-hidden
        className={cn(
          "relative font-semibold",
          variant === "light" ? "text-rose-gold-light" : "text-burgundy-light"
        )}
        style={{ letterSpacing: "0.18em" }}
      >
        Å
        <span
          className="absolute -top-1 -right-1 w-1 h-1 rounded-full bg-rose-gold"
          aria-hidden
        />
      </span>
    </span>
  );
}

// Compact brand mark (the Å ring) for favicon-style use
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-10 h-10 rounded-full bg-burgundy-gradient text-rose-gold-light font-brand text-xl",
        className
      )}
    >
      Å
    </span>
  );
}
