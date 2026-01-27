"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import PracticalAddressSection from "./PracticalAddressSection";
import PracticalContactSection from "./PracticalContactSection";
import PracticalAccessibilitySection from "./PracticalAccessibilitySection";
import PracticalDirectionsSection from "./PracticalDirectionsSection";

interface LocationPracticalProps {
	dict: any;
	venue: {
		name: string;
		address: string;
		phone: string;
		email: string;
		website: string;
		lat: number;
		lng: number;
	};
	isMobile: boolean;
	isIOS: boolean;
}

export default function LocationPractical({
	dict,
	venue,
	isMobile,
	isIOS,
}: LocationPracticalProps) {
	const [copied, setCopied] = useState(false);
	const [hoveredSection, setHoveredSection] = useState<string>("address");

	const handleCopyAddress = () => {
		// Try clipboard API first (modern browsers)
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(venue.address).catch(() => {
				// Fallback to old method if clipboard API fails
				copyToClipboardFallback(venue.address);
			});
		} else {
			// Fallback for older browsers or insecure contexts
			copyToClipboardFallback(venue.address);
		}
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const copyToClipboardFallback = (text: string) => {
		const textarea = document.createElement("textarea");
		textarea.value = text;
		textarea.style.position = "fixed";
		textarea.style.opacity = "0";
		document.body.appendChild(textarea);
		textarea.select();
		try {
			document.execCommand("copy");
		} catch (err) {
			console.error("Fallback copy failed:", err);
		}
		document.body.removeChild(textarea);
	};


	return (
		<Section variant="soft" spacing="lg" className="py-12 sm:py-20">
			<div className="max-w-7xl mx-auto sm:px-6">
				{/* Desktop version with expandable sections */}
				<div className="hidden md:flex gap-2 lg:gap-6 h-96">
					<PracticalAddressSection
						dict={dict}
						venue={venue}
						copied={copied}
						onCopyAddress={handleCopyAddress}
						hoveredSection={hoveredSection}
						onMouseEnter={setHoveredSection}
					/>
					<PracticalContactSection
						dict={dict}
						venue={venue}
						hoveredSection={hoveredSection}
						onMouseEnter={setHoveredSection}
					/>
					<PracticalAccessibilitySection
						dict={dict}
						hoveredSection={hoveredSection}
						onMouseEnter={setHoveredSection}
					/>
					<PracticalDirectionsSection
						dict={dict}
						venue={venue}
						isMobile={isMobile}
						isIOS={isIOS}
						hoveredSection={hoveredSection}
						onMouseEnter={setHoveredSection}
					/>
				</div>

				{/* Mobile version - stacked vertically with same expandable style */}
				<div className="md:hidden flex flex-col gap-4 h-[80vh]">
					<PracticalAddressSection
						dict={dict}
						venue={venue}
						copied={copied}
						onCopyAddress={handleCopyAddress}
						hoveredSection={hoveredSection}
						onMouseEnter={setHoveredSection}
					/>
					<PracticalContactSection
						dict={dict}
						venue={venue}
						hoveredSection={hoveredSection}
						onMouseEnter={setHoveredSection}
					/>
					<PracticalAccessibilitySection
						dict={dict}
						hoveredSection={hoveredSection}
						onMouseEnter={setHoveredSection}
					/>
					<PracticalDirectionsSection
						dict={dict}
						venue={venue}
						isMobile={isMobile}
						isIOS={isIOS}
						hoveredSection={hoveredSection}
						onMouseEnter={setHoveredSection}
					/>
				</div>
			</div>
		</Section>
	);
}
