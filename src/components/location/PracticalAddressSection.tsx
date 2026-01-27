import React from "react";
import { MdContentCopy, MdDone, MdOutlineLocationOn } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import ExpandableSection from "./ExpandableSection";

interface PracticalAddressSectionProps {
	dict: any;
	venue: { address: string };
	copied: boolean;
	onCopyAddress: () => void;
	hoveredSection: string;
	onMouseEnter: (id: string) => void;
}

export default function PracticalAddressSection({
	dict,
	venue,
	copied,
	onCopyAddress,
	hoveredSection,
	onMouseEnter,
}: PracticalAddressSectionProps) {

	return (
		<ExpandableSection
			id="address"
			icon={<CiLocationOn className="w-5 h-5 text-foreground" />}
			title={dict.venue.address}
			hoveredSection={hoveredSection}
			onMouseEnter={onMouseEnter}
		>
			<div className="space-y-4 pt-4">
				<button
					onClick={onCopyAddress}
					className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-primary transition-colors group/btn"
				>
					<span className="line-clamp-2 text-left">{venue.address}</span>
					{copied ? (
						<MdDone className="w-4 h-4 text-green-600 flex-shrink-0" />
					) : (
						<MdContentCopy className="w-8 h-8 opacity-50 group-hover/btn:opacity-100" />
					)}
				</button>
			</div>
			<p className="text-xs text-foreground-muted pt-4 border-t border-primary/10">
				{copied ? dict.venue.copiedAddress : dict.venue.copyAddress}
			</p>
		</ExpandableSection>
	);
}
