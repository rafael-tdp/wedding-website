import Link from "next/link";
import React from "react";

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "soft" | "bordered";
  // New props for rich card content
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  link?: string;
  learnMoreText?: string;
  withFrame?: boolean;
}

export default function Card({ 
  children,
  className = "",
  variant = "default",
  icon,
  title,
  description,
  link,
  learnMoreText = "En savoir plus",
  withFrame = false,

}: CardProps) {
  const variantStyles = {
    default: "group relative bg-background border border-primary/10 hover:border-primary/20",
    soft: "group relative bg-background-soft border border-primary/10 hover:border-primary/50",
    bordered: "group relative bg-background border-2 border-primary/20 hover:border-primary/40",
  };
  
  const cardContent = (
    <div className={`transition-all duration-300 ${variantStyles[variant]} ${className}`}>
      {/* Animated gradient border overlay on hover */}
      {variant === "default" && (
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none" />
      )}

      {/* Elegant corner flourish - top left */}
      <div className="absolute top-0 left-0 w-[calc(50%-0.5rem)] h-[calc(50%-0.5rem)] opacity-50 transition-opacity duration-500">
        <div className="absolute top-2 left-2 w-[30%] h-px group-hover:w-full transition-all duration-700 ease-out">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
        <div className="absolute top-2 left-2 w-px h-[30%] group-hover:h-full transition-all duration-700 ease-out">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
      </div>

      {/* Elegant corner flourish - top right */}
      <div className="absolute top-0 right-0 w-[calc(50%-0.5rem)] h-[calc(50%-0.5rem)] opacity-50 transition-opacity duration-500">
        <div className="absolute top-2 right-2 w-[30%] h-px group-hover:w-full transition-all duration-700 ease-out">
          <div className="absolute inset-0 bg-gradient-to-l from-primary/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-l from-primary/60 to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
        <div className="absolute top-2 right-2 w-px h-[30%] group-hover:h-full transition-all duration-700 ease-out">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
      </div>

      {/* Elegant corner flourish - bottom left */}
      <div className="absolute bottom-0 left-0 w-[calc(50%-0.5rem)] h-[calc(50%-0.5rem)] opacity-50 transition-opacity duration-500">
        <div className="absolute bottom-2 left-2 w-[30%] h-px group-hover:w-full transition-all duration-700 ease-out">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
        <div className="absolute bottom-2 left-2 w-px h-[30%] group-hover:h-full transition-all duration-700 ease-out">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
      </div>
      
      {/* Elegant corner flourish - bottom right */}
      <div className="absolute bottom-0 right-0 w-[calc(50%-0.5rem)] h-[calc(50%-0.5rem)] opacity-50 transition-opacity duration-500">
        <div className="absolute bottom-2 right-2 w-[30%] h-px group-hover:w-full transition-all duration-700 ease-out">
          <div className="absolute inset-0 bg-gradient-to-l from-primary/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-l from-primary/60 to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
        <div className="absolute bottom-2 right-2 w-px h-[30%] group-hover:h-full transition-all duration-700 ease-out">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
      </div>

      
      {/* Decorative top accent line */}
      {/* <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
      
      {/* Content */}
      <div className={`relative z-10 h-full ${withFrame ? 'p-2 sm:p-4 border border-[1px] border-primary/10' : ''}`}>
        {/* Rich card content (icon + title + description + link) */}
        {(icon || title || description) ? (
          <div className="flex flex-col items-center justify-center text-center gap-4 sm:gap-4 md:gap-5 h-full p-0 sm:p-2">
            {/* Icon in circle */}
            {icon && (
              <div className="relative p-3 sm:p-3 md:p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary flex-shrink-0">
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">{icon}</div>
              </div>
            )}

            {/* Content container */}
            <div className="space-y-1 sm:space-y-2 md:space-y-3 flex flex-col justify-between md:items-center md:text-center">
              {/* Title */}
              {title && (
                <h3 className="text-base md:text-lg text-primary uppercase tracking-wide font-medium" style={{ fontFamily: "var(--font-gilda)" }}>
                  {title}
                </h3>
              )}

              {/* Description */}
              {description && (
                <p className="text-foreground-muted text-sm md:text-base leading-relaxed">
                  {description}
                </p>
              )}

              {/* Link */}
              {link && (
                <div className="text-primary font-medium text-xs sm:text-xs md:text-sm flex gap-1 sm:gap-2 group-hover:gap-3 transition-all items-center justify-center mt-1 sm:mt-2 md:mt-3">
                  <span>{learnMoreText}</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Default children rendering
          children
        )}
      </div>
    </div>
  );

  // If link is provided, wrap entire card in Link
  if (link) {
    return (
      <Link href={link} className="block group h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
