import React from "react";
import { MdEmail, MdPhone, MdLanguage } from "react-icons/md";
import ExpandableSection from "./ExpandableSection";

interface PracticalContactSectionProps {
	dict: any;
	venue: {
		phone: string;
		email: string;
		website: string;
	};
	hoveredSection: string;
	onMouseEnter: (id: string) => void;
}

export default function PracticalContactSection({
	dict,
	venue,
	hoveredSection,
	onMouseEnter,
}: PracticalContactSectionProps) {
	const contactLinks = (
		<div className="text-foreground-muted flex flex-col gap-3">
			<a
				href={`tel:${venue.phone}`}
				className={`flex items-center gap-2 hover:text-primary transition-colors ${"text-sm"}`}
			>
				<MdPhone className="w-4 h-4 flex-shrink-0" />
				<span className={"line-clamp-1 underline"}>{venue.phone}</span>
			</a>
			<a
				href={`mailto:${venue.email}`}
				className={`flex items-center gap-2 hover:text-primary transition-colors ${"text-sm"}`}
			>
				<MdEmail className="w-4 h-4 flex-shrink-0" />
				<span className={"line-clamp-1 text-sm underline"}>
					{venue.email}
				</span>
			</a>
			<a
				href={venue.website}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-2 hover:text-primary transition-colors text-sm"
			>
				<MdLanguage className="w-4 h-4 flex-shrink-0" />
				<span className={"line-clamp-1 underline"}>
					{dict.venue.website}
				</span>
			</a>
		</div>
	);

	return (
		<ExpandableSection
			id="contact"
			icon={<MdEmail className="w-12 h-12 text-primary" />}
			title={dict.venue.contact}
			hoveredSection={hoveredSection}
			onMouseEnter={onMouseEnter}
		>
			<div className="space-y-3 pt-4">{contactLinks}</div>
		</ExpandableSection>
	);
}
