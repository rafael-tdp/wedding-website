import React from "react";
import { MdInfo } from "react-icons/md";
import ExpandableSection from "./ExpandableSection";

interface PracticalAccessibilitySectionProps {
	dict: any;
	hoveredSection: string;
	onMouseEnter: (id: string) => void;
}

export default function PracticalAccessibilitySection({
	dict,
	hoveredSection,
	onMouseEnter,
}: PracticalAccessibilitySectionProps) {
	return (
		<ExpandableSection
			id="accessibility"
			icon={<MdInfo className="w-12 h-12 text-primary" />}
			title={dict.venue.accessibility}
			hoveredSection={hoveredSection}
			onMouseEnter={onMouseEnter}
		>
			<p className="text-sm text-foreground-muted leading-relaxed flex-1 pt-4 sm:line-clamp-4">
				{dict.venue.accessibilityText}
			</p>
		</ExpandableSection>
	);
}
