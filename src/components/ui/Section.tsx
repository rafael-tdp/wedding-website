"use client";

import { useState, useEffect } from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "soft" | "gradient";
  spacing?: "none" | "sm" | "md" | "lg";
  isHero?: boolean;
  backgroundImage?: string;
}

export default function Section({
  children,
  className = "",
  variant = "default",
  spacing = "lg",
  isHero = false,
  backgroundImage,
}: SectionProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const variantStyles = {
    default: "bg-background",
    soft: "bg-background-soft",
    gradient: "gradient-elegant",
  };

  const spacingStyles = {
    none: "py-0",
    sm: "py-8 md:py-12",
    md: "py-12 md:py-16",
    lg: "py-16 md:py-section",
  };

  const heroStyles = isHero ? "pt-28 md:pt-32" : "";

  const sectionStyle = backgroundImage
    ? {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: isMobile ? "scroll" : "fixed",
      }
    : undefined;

  return (
    <section
      style={sectionStyle}
      className={`${variantStyles[variant]} ${spacingStyles[spacing]} ${heroStyles} ${className} relative`}
    >
      {backgroundImage && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/60 pointer-events-none" />
      )}
      <div className="relative container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {children}
      </div>
    </section>
  );
}
