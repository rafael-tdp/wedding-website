interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "soft" | "gradient";
  spacing?: "none" | "sm" | "md" | "lg";
  isHero?: boolean;
}

export default function Section({
  children,
  className = "",
  variant = "default",
  spacing = "lg",
  isHero = false,
}: SectionProps) {
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

  return (
    <section
      className={`${variantStyles[variant]} ${spacingStyles[spacing]} ${heroStyles} ${className}`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {children}
      </div>
    </section>
  );
}
