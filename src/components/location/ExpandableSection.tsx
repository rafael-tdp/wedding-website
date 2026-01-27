import React from "react";
import { PiArrowRightThin } from "react-icons/pi";

interface ExpandableSectionProps {
	id: string;
	icon: React.ReactNode;
	title?: string;
	children: React.ReactNode;
	hoveredSection: string;
	onMouseEnter: (id: string) => void;
}

export default function ExpandableSection({
	id,
	icon,
	title,
	children,
	hoveredSection,
	onMouseEnter,
}: ExpandableSectionProps) {
	const isOpen = hoveredSection === id;

	return (
		<div
			onMouseEnter={() => onMouseEnter(id)}
			className={`
				rounded-2xl cursor-pointer overflow-hidden
				border border-primary/10
				p-6 sm:p-8
				transition-all duration-1000 ease-in-out delay-0
                flex flex-col justify-between relative
				justify-center sm:justify-between
				${
					isOpen
						? "flex-[4] sm:flex-[2] bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30"
						: "flex-1 bg-background/50"
				}
			`}
		>
			{/* Header - visible always */}
			<div className={`flex flex-row gap-4 items-center`}>
				{/* <div className={`flex items-center justify-center`}>
					{icon && icon}
				</div> */}
				{title && (
					<h3 className="text-lg font-medium text-foreground text-center whitespace-nowrap font-gilda uppercase">
						{title}
					</h3>
				)}
			</div>

			{/* Content - appears when open */}
			<div
				className={`transition-opacity duration-1000
					${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
				`}
			>
				{children}
			</div>

            {/* Icon - Hover to expand */}
            <div
                className={`absolute right-6 bottom-6 w-full flex justify-end transition-all duration-500 ease-in-out mt-4
                    ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
                `}
            >
                <div className="text-3xl text-black p-2 rounded-full hover:bg-gray-100 hover:text-foreground transition-all bg-primary/0"
                >
                    <PiArrowRightThin />
                </div>
            </div>
		</div>
	);
}
