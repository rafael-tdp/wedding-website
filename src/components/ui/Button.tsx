interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline";
  size?: "xs" | "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "rounded-full uppercase tracking-wider font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xxs 2xl:text-xs px-6 sm:px-6 2xl:px-8 py-4 sm:py-4 2xl:py-5";
  
  const variantStyles = {
    primary: "border-2 border-primary bg-primary text-white hover:bg-primary-dark active:scale-95 hover:border-primary-dark",
    secondary: "border-2 border-secondary bg-secondary text-white hover:bg-secondary-dark hover:border-secondary-dark active:scale-95",
    accent: "border-2 border-accent bg-accent text-white hover:bg-accent-dark active:scale-95",
    outline: "border-[1px] border-primary text-primary hover:bg-primary-dark hover:border-primary-dark hover:text-white",
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}