import React from "react";
import { MdArrowForward } from "react-icons/md";
import { SiGooglemaps, SiWaze, SiApple } from "react-icons/si";
import ExpandableSection from "./ExpandableSection";
import { Button } from "../ui";

interface PracticalDirectionsSectionProps {
	dict: any;
	venue: {
		address: string;
		lat: number;
		lng: number;
	};
	isMobile: boolean;
	isIOS: boolean;
	hoveredSection: string;
	onMouseEnter: (id: string) => void;
}

export default function PracticalDirectionsSection({
	dict,
	venue,
	isMobile,
	isIOS,
	hoveredSection,
	onMouseEnter,
}: PracticalDirectionsSectionProps) {
	const navigationLinks = (
		<>
			<p className="hidden sm:block mb-4 text-sm text-foreground-muted line-clamp-3">
				{dict.venue.directionsText}
			</p>
			{isIOS ? (
				<>
					<a
						href={`maps://maps.apple.com/?address=${encodeURIComponent(
							venue.address,
						)}&adr=${venue.lat},${venue.lng}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button
							variant="primary"
							className="flex items-center justify-center gap-2 px-4 py-2 text-sm transition-all w-full"
						>
							<SiApple className="w-4 h-4" />
							Apple Maps
						</Button>
					</a>
					<a
						href={`https://waze.com/ul?ll=${venue.lat},${venue.lng}&navigate=yes`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button
							variant="secondary"
							className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm transition-all w-full"
						>
							<SiWaze className="w-4 h-4" />
							Waze
						</Button>
					</a>
				</>
			) : (
				<>
					<a
						href={`https://maps.app.goo.gl/?q=${venue.lat},${venue.lng}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button
							variant="primary"
							className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm transition-all w-full"
						>
							<SiGooglemaps className="w-4 h-4" />
							Google Maps
						</Button>
					</a>
					<a
						href={`https://waze.com/ul?ll=${venue.lat},${venue.lng}&navigate=yes`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button
							variant="secondary"
							className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm transition-all w-full"
						>
							<SiWaze className="w-4 h-4" />
							Waze
						</Button>
					</a>
				</>
			)}
		</>
	);

	return (
		<ExpandableSection
			id="directions"
			icon={<MdArrowForward className="w-12 h-12 text-primary" />}
			title={dict.venue.directions || "Accès"}
			hoveredSection={hoveredSection}
			onMouseEnter={onMouseEnter}
		>
			<div className="flex flex-col gap-2 pt-4">{navigationLinks}</div>
		</ExpandableSection>
	);
}
