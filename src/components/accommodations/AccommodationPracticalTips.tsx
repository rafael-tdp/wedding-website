"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import {
	MdLocationOn,
	MdDirectionsCar,
	MdAccessTime,
	MdRateReview,
} from "react-icons/md";
import { Title } from "../ui";

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
			<div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 sm:space-y-10 px-2 sm:px-4 sm:px-0">
				<Title level="h2" align="center" withAccent>
					{accommodation.practicalTipsSection.title}
				</Title>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 auto-rows-fr">
					{tips.map((tip, index) => {
						const Icon = tip.icon;
						return (
							<div
								key={index}
								className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow h-full flex flex-col animate-fade-in"
								style={{
									animationDelay: `${index * 100}ms`,
								}}
							>
								<div className="flex items-start gap-3 sm:gap-4">
										<div className="text-xl sm:text-2xl md:text-3xl flex-shrink-0 text-primary">
											<Icon />
										</div>
										<div className="flex-grow">
											<h3 className="text-sm sm:text-base md:text-lg font-serif text-foreground mb-0.5 sm:mb-2">
												{tip.title}
											</h3>
											<p className="text-foreground-muted text-xs sm:text-xs md:text-sm leading-relaxed">
											{tip.description}
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				<div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap pt-4">
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
