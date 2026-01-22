import { Playfair_Display } from "next/font/google";

const playfairDisplay = Playfair_Display({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-playfair",
});

interface TitleProps {
	children: React.ReactNode;
	level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	className?: string;
	align?: "left" | "center" | "right";
	withAccent?: boolean;
	withBackgroundLetter?: boolean;
	style?: React.CSSProperties;
}

export default function Title({
	children,
	level = "h2",
	className = "",
	align = "left",
	withAccent = false,
	withBackgroundLetter = false,
	style,
}: TitleProps) {
	const Tag = level;

	// Récupérer la première lettre du texte
	let firstLetter = "";
	if (withBackgroundLetter && typeof children === "string") {
		firstLetter = children.charAt(0).toUpperCase();
	}

	const baseStyles = "font-serif font-normal text-foreground";

	const sizeStyles = {
		h1: "text-5xl md:text-7xl lg:text-8xl",
		h2: "text-2xl md:text-4xl lg:text-5xl",
		h3: "text-2xl md:text-3xl lg:text-4xl",
		h4: "text-xl md:text-2xl lg:text-3xl",
		h5: "text-lg md:text-xl lg:text-2xl",
		h6: "text-base md:text-lg lg:text-xl",
	};

	const fontStyles = {
		h1: "italic",
		h2: "",
		h3: "",
		h4: "",
		h5: "",
		h6: "",
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
				style={
					level === "h1"
						? { fontFamily: "var(--font-parisienne)", ...style }
						: level === "h2" || level === "h3" || level === "h4" || level === "h5" || level === "h6"
						? { fontFamily: "var(--font-playfair)", ...style }
						: style
				}
			>
				{children}
			</Tag>
			{withAccent && (
				<div
					className={`mt-0 sm:mt-2 flex items-center ${
						align === "center"
							? "justify-center"
							: align === "right"
							? "justify-end"
							: "justify-start"
					}`}
				>
					<svg 
						width="160" 
						height="20" 
						viewBox="0 0 160 20" 
						fill="none" 
						className="text-accent"
					>
						<path d="M0 10 L70 10" stroke="currentColor" strokeWidth="0.8" />
						<rect x="77" y="7" width="6" height="6" transform="rotate(45 80 10)" fill="currentColor" opacity="1" />
						<path d="M90 10 L160 10" stroke="currentColor" strokeWidth="0.8" />
					</svg>
				</div>
			)}
		</div>
	);
}
