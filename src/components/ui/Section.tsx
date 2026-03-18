"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "soft" | "gradient";
  spacing?: "none" | "sm" | "md" | "lg";
  isHero?: boolean;
  backgroundImage?: string;
  backgroundPosition?: string;
}

export default function Section({
  children,
  className = "",
  variant = "default",
  spacing = "lg",
  isHero = false,
  backgroundImage,
  backgroundPosition = "center center",
}: SectionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(!isHero);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const lastScrollRef = useRef(0);

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

  useLayoutEffect(() => {
    if (!isHero || !backgroundImage || !backgroundRef.current) return;

    const handleScroll = () => {
      lastScrollRef.current = window.scrollY;
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        if (backgroundRef.current) {
          const parallaxY = lastScrollRef.current * 0.15;
          backgroundRef.current.style.transform = `translateY(${parallaxY}px) scale(1.08)`;
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isHero, backgroundImage]);

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

  const heroStyles = isHero ? "pt-32 md:pt-40 lg:pt-48 xl:pt-56" : "";

  // Animation classes pour les héros
  const animationClasses = isHero && isVisible ? "animate-fade-in" : isHero ? "opacity-0" : "";

  const sectionStyle = backgroundImage && !isHero
    ? {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: isMobile ? "center bottom" : backgroundPosition,
        backgroundAttachment: "fixed",
      }
    : undefined;

  // Parallax background pour les héros (style initial, transform sera mis à jour via ref)
  const backgroundStyle = isHero && backgroundImage
    ? {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: isMobile ? "center bottom" : backgroundPosition,
        willChange: "transform",
        transform: "translateY(0px) scale(1.08)",
      }
    : undefined;

  return (
    <section
      style={sectionStyle}
      className={`${variantStyles[variant]} ${spacingStyles[spacing]} ${heroStyles} ${animationClasses} ${className} relative transition-opacity duration-1000 ${isHero && backgroundImage ? "overflow-hidden" : ""}`}
    >
      {isHero && backgroundImage && (
        <div
          ref={backgroundRef}
          className="absolute inset-0"
          style={backgroundStyle}
        />
      )}
      {backgroundImage && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/60 pointer-events-none" />
      )}
      <div className="relative container mx-auto px-6 md:px-6 lg:px-8 max-w-7xl">
        {children}
      </div>
    </section>
  );
}
