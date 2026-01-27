interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "soft" | "bordered";
}

export default function Card({ 
  children, 
  className = "",
  variant = "default"
}: CardProps) {
  const variantStyles = {
    default: "bg-background border border-primary/10 shadow-elegant",
    soft: "bg-background-soft",
    bordered: "bg-background border-2 border-primary/20",
  };
  
  return (
    <div className={`transition-all ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
