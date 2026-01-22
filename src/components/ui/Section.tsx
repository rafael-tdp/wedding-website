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
  const [isVisible, setIsVisible] = useState(!isHero);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isHero) return;

    // Trigger animation après le rendu
    const timer = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(timer);
  }, [isHero]);

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

  // Animation classes pour les héros
  const animationClasses = isHero && isVisible ? "animate-fade-in" : isHero ? "opacity-0" : "";

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
      className={`${variantStyles[variant]} ${spacingStyles[spacing]} ${heroStyles} ${animationClasses} ${className} relative transition-opacity duration-1000`}
    >
      {backgroundImage && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/60 pointer-events-none" />
      )}
      <div className="relative container mx-auto px-6 md:px-6 lg:px-8 max-w-7xl">
        {children}
      </div>
    </section>
  );
}
