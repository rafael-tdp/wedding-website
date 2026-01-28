"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import InfoCards from "@/components/ui/InfoCards";
import { Title } from "../ui";
import { CiLocationOn, CiStar, CiTimer } from "react-icons/ci";
import { PiCarThin } from "react-icons/pi";

interface AccommodationPracticalTipsProps {
	dict: any;
}

export default function AccommodationPracticalTips({
	dict,
}: AccommodationPracticalTipsProps) {
	const { accommodation } = dict;

	const tips = [
		{
			icon: CiLocationOn,
			title: accommodation.practicalTipsSection.distance.title,
			description:
				accommodation.practicalTipsSection.distance.description,
		},
		{
			icon: PiCarThin,
			title: accommodation.practicalTipsSection.travel.title,
			description: accommodation.practicalTipsSection.travel.description,
		},
		{
			icon: CiTimer,
			title: accommodation.practicalTipsSection.booking.title,
			description: accommodation.practicalTipsSection.booking.description,
		},
		{
			icon: CiStar,
			title: accommodation.practicalTipsSection.reviews.title,
			description: accommodation.practicalTipsSection.reviews.description,
		},
	];

	return (
		<Section variant="soft" spacing="lg">
			<div className="max-w-4xl mx-auto">
				<div className="mb-12">
					<Title level="h2" align="center" withAccent={true}>
						{accommodation.practicalTipsSection.title}
					</Title>
					<p className="text-center text-foreground-muted mt-4">
						{accommodation.practicalTipsText}
					</p>
				</div>

				<InfoCards
					title={accommodation.practicalTips.title}
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
