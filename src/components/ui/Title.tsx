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
		h2: "text-2xl md:text-3xl lg:text-4xl",
		h3: "text-2xl md:text-3xl lg:text-4xl",
		h4: "text-xl md:text-2xl lg:text-3xl",
		h5: "text-lg md:text-xl lg:text-2xl",
		h6: "text-base md:text-lg lg:text-xl",
	};

	const fontStyles = {
		h1: "italic",
		h2: "uppercase tracking-wide",
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
						: level === "h2" ? { fontFamily: "var(--font-gilda)", ...style } : level === "h3" || level === "h4" || level === "h5" || level === "h6"
						? { fontFamily: "var(--font-gilda)", ...style }
						: style
				}
			>
				{children}
			</Tag>
			{withAccent && (
				<div
					className={`mt-2 sm:mt-3 h-px w-40 bg-gradient-to-r from-transparent via-accent to-transparent ${
						align === "center"
							? "mx-auto"
							: align === "right"
							? "ml-auto"
							: ""
					}`}
				></div>
			)}
		</div>
	);
}
