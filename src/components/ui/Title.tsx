interface TitleProps {
  children: React.ReactNode;
  level?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  align?: "left" | "center" | "right";
  withAccent?: boolean;
  style?: React.CSSProperties;
}

export default function Title({
  children,
  level = "h2",
  className = "",
  align = "left",
  withAccent = false,
  style,
}: TitleProps) {
  const Tag = level;

  const baseStyles = "font-serif font-normal text-foreground";

  const sizeStyles = {
    h1: "text-5xl md:text-7xl lg:text-8xl",
    h2: "text-3xl md:text-4xl lg:text-5xl",
    h3: "text-2xl md:text-3xl lg:text-4xl",
    h4: "text-xl md:text-2xl lg:text-3xl",
  };

  const fontStyles = {
    h1: "italic",
    h2: "",
    h3: "",
    h4: "",
  };

  const alignStyles = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={alignStyles[align]}>
      <Tag
        className={`${baseStyles} ${sizeStyles[level]} ${fontStyles[level]} ${className}`}
        style={level === "h1" ? { fontFamily: "var(--font-parisienne)", ...style } : style}
      >
        {children}
      </Tag>
      {withAccent && (
        <div
          className={`mt-3 h-1 w-16 bg-accent ${
            align === "center" ? "mx-auto" : align === "right" ? "ml-auto" : ""
          }`}
        />
      )}
    </div>
  );
}
