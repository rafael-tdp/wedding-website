"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import InfoCards from "@/components/ui/InfoCards";
import {
	MdLocationOn,
	MdDirectionsCar,
	MdAccessTime,
	MdRateReview,
} from "react-icons/md";

interface AccommodationPracticalTipsProps {
	dict: any;
}

export default function AccommodationPracticalTips({
	dict,
}: AccommodationPracticalTipsProps) {
	const { accommodation } = dict;
	
	const tips = [
		{
			icon: MdLocationOn,
			title: accommodation.practicalTipsSection.distance.title,
			description: accommodation.practicalTipsSection.distance.description,
		},
		{
			icon: MdDirectionsCar,
			title: accommodation.practicalTipsSection.travel.title,
			description: accommodation.practicalTipsSection.travel.description,
		},
		{
			icon: MdAccessTime,
			title: accommodation.practicalTipsSection.booking.title,
			description: accommodation.practicalTipsSection.booking.description,
		},
		{
			icon: MdRateReview,
			title: accommodation.practicalTipsSection.reviews.title,
			description: accommodation.practicalTipsSection.reviews.description,
		},
	];

	return (
		<Section variant="soft" spacing="lg">
			<div className="max-w-4xl mx-auto">
				<InfoCards 
					title={accommodation.practicalTipsSection.title}
					cards={tips}
					columns="2"
				/>

				<div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap pt-8 sm:pt-12">
					<Link href="/location" className="w-full sm:w-auto">
						<Button
							variant="primary"
							size="lg"
							className="w-full sm:w-auto"
						>
							{accommodation.seeVenue}
						</Button>
					</Link>
					<Link href="/schedule" className="w-full sm:w-auto">
						<Button
							variant="outline"
							size="lg"
							className="w-full sm:w-auto"
						>
							{accommodation.seeProgramme}
						</Button>
					</Link>
				</div>
			</div>
		</Section>
	);
}
